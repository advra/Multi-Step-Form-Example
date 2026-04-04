"use client";

// src/features/listingWizard/ListingWizard.tsx
import type { ListingDraft, WizardMode } from "@/listingWizard/types";
import { useMultiListingForm } from "@/listingWizard/wizard/useMultiListingForm";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

type Props = {
  mode: WizardMode;
  initialDraft?: Partial<ListingDraft>; // in edit mode: hydrate from listing
};

export function ListingWizard({ mode, initialDraft }: Readonly<Props>) {
  const wizard = useMultiListingForm({ mode, initialDraft });

  const Step = wizard.currentStep.Component;

  useEffect(() => {
    console.log(
      `Wizard Mode: ${wizard.draft.mode} Version: ${wizard.draft.version}`,
    );
  }, [wizard.draft.mode, wizard.draft.version]);

  return (
    <div className="container mx-auto p-6 space-y-4">
      {/* Progress / step tabs */}
      <div className="flex flex-wrap gap-2">
        {wizard.steps.map((s, idx) => {
          const active = s.id === wizard.currentStepId;
          return (
            <Button
              key={s.id}
              type="button"
              variant={active ? "default" : "outline"}
              size="sm"
              onClick={() => wizard.goTo(s.id)}
            >
              Step {idx + 1} {active && s.title}
            </Button>
          );
        })}
      </div>

      <div>
        <Step
          draft={wizard.draft}
          setDraft={wizard.setDraft}
          errors={wizard.errors}
          goNext={wizard.goNext}
          goBack={wizard.goBack}
          goTo={wizard.goTo}
          validateAll={wizard.validateAll}
        />
      </div>
    </div>
  );
}
