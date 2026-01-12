'use client';

// src/features/listingWizard/wizard/useMultiListingForm.ts
import { useState, useCallback, useMemo, useEffect } from "react";
import type {
  ListingDraft,
  StepId,
  StepConfig,
  StepErrors,
  WizardMode,
} from "../types";
import { stepConfigs } from "./stepConfigs";
import { clearDraft, loadDraft, saveDraft } from "./persistence";
import { fullDraftSchema, zodErrorsToMap } from "../schemas";

type Params = {
  mode: WizardMode;
  initialDraft?: Partial<ListingDraft>; // for edit mode hydrate from listing
  persistKeyScope?: string; // optional: tenantId/userId scope in future
};

function makeBlankDraft(mode: WizardMode): ListingDraft {
  return { version: 1, mode };
}

function sanitizeDraft(next: ListingDraft, prev: ListingDraft): ListingDraft {
  // If franchise changed, wipe product selection + dependent sections
  if (next.franchise !== prev.franchise) {
    return {
      ...next,
      productType: undefined,
      catalogSelection: undefined,
      listingDetails: undefined,
      pokemonCard: undefined,
      yugiohCard: undefined,
      pokemonSealed: undefined,
      yugiohSealed: undefined,
    };
  }

  // If productType changed, wipe catalog + listingDetails + branch-specific
  if (next.productType !== prev.productType) {
    const cleared: ListingDraft = {
      ...next,
      catalogSelection: undefined,
      listingDetails: undefined,
      pokemonCard: undefined,
      yugiohCard: undefined,
      pokemonSealed: undefined,
      yugiohSealed: undefined,
    };
    return cleared;
  }

  return next;
}

export function useMultiListingForm(params: Params) {
  const { mode, initialDraft } = params;

  const [draft, setDraft] = useState<ListingDraft>(() => {
    // load persisted draft for create flows; for edit flows, prefer initialDraft
    const persisted = loadDraft();
    if (mode === "edit") {
      return {
        ...makeBlankDraft("edit"),
        ...initialDraft,
      } as ListingDraft;
    }
    return (
      persisted ?? {
        ...makeBlankDraft("create"),
        ...initialDraft,
      }
    );
  });

  const [currentStepId, setCurrentStepId] = useState<StepId>(() => {
    return mode === "edit" ? "review" : "franchise";
  });

  const [errors, setErrors] = useState<StepErrors>({});

  const setDraftCallback = useCallback(
    (updater: (prev: ListingDraft) => ListingDraft) => {
      setDraft((prev) => {
        const nextRaw = updater(prev);
        const next = sanitizeDraft(nextRaw, prev);
        return next;
      });
    },
    []
  );

  const steps = useMemo(() => {
    return stepConfigs.filter((s) => (s.when ? s.when(draft) : true));
  }, [draft]);

  const currentIndex = useMemo(() => {
    const idx = steps.findIndex((s) => s.id === currentStepId);
    return Math.max(idx, 0);
  }, [steps, currentStepId]);

  const currentStep = steps[currentIndex];

  // Ensure currentStepId always valid as draft changes
  useEffect(() => {
    if (!steps.some((s) => s.id === currentStepId)) {
      // fallback to nearest meaningful step
      setCurrentStepId(
        mode === "edit" ? "review" : steps[0]?.id ?? "franchise"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.map((s) => s.id).join("|")]);

  // Persist on change (create mode only by default; you can persist edit drafts too)
  useEffect(() => {
    if (draft.mode === "create") saveDraft(draft);
  }, [draft]);

  const goTo = useCallback((id: StepId) => {
    setErrors({});
    setCurrentStepId(id);
  }, []);

  const goBack = useCallback(() => {
    setErrors({});
    const prev = steps[currentIndex - 1];
    if (prev) setCurrentStepId(prev.id);
  }, [steps, currentIndex]);

  const validateStep = useCallback(
    (id?: StepId) => {
      const targetId = id ?? currentStep.id;
      const step = steps.find((s) => s.id === targetId);
      if (!step?.validate) {
        setErrors({});
        return true;
      }
      const res = step.validate(draft);
      if (res.ok) {
        setErrors({});
        return true;
      }
      setErrors(res.errors);
      return false;
    },
    [steps, currentStep.id, draft]
  );

  const goNext = useCallback(() => {
    const ok = validateStep(currentStep.id);
    if (!ok) return;

    const next = steps[currentIndex + 1];
    setErrors({});
    if (next) setCurrentStepId(next.id);
  }, [validateStep, currentStep.id, steps, currentIndex]);

  const validateAll = useCallback(() => {
    const res = fullDraftSchema.safeParse(draft);
    if (res.success) {
      setErrors({});
      return true;
    }
    setErrors(zodErrorsToMap(res));
    return false;
  }, [draft]);

  const reset = useCallback(() => {
    clearDraft();
    setErrors({});
    setDraft(makeBlankDraft(mode));
    setCurrentStepId(mode === "edit" ? "review" : "franchise");
  }, [mode, setDraft]);

  return {
    draft,
    setDraft: setDraftCallback,

    steps,
    currentStep,
    currentIndex,
    currentStepId,

    errors,

    goNext,
    goBack,
    goTo,

    validateStep,
    validateAll,

    reset,
  };
}
