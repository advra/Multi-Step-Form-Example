"use client";

// src/features/listingWizard/ListingWizard.tsx
import type { ListingDraft, WizardMode } from "@/listingWizard/types";
import { useMultiListingForm } from "@/listingWizard/wizard/useMultiListingForm";

type Props = {
  mode: WizardMode;
  initialDraft?: Partial<ListingDraft>; // in edit mode: hydrate from listing
};

export function ListingWizard({ mode, initialDraft }: Readonly<Props>) {
  const wizard = useMultiListingForm({ mode, initialDraft });

  const Step = wizard.currentStep.Component;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      {/* Progress / step tabs */}
      <div className="flex flex-wrap gap-2">
        {wizard.steps.map((s, idx) => {
          const active = s.id === wizard.currentStepId;
          return (
            <button
              key={s.id}
              type="button"
              className={`text-sm px-3 py-2 rounded border ${
                active ? "font-bold" : ""
              }`}
              onClick={() => wizard.goTo(s.id)}
            >
              {idx + 1}. {s.title}
            </button>
          );
        })}
      </div>

      <div className="border rounded p-5">
        <Step
          draft={wizard.draft}
          setDraft={wizard.setDraft}
          errors={wizard.errors}
          goNext={wizard.goNext}
          goBack={wizard.goBack}
          goTo={wizard.goTo}
        />
      </div>

      <div className="text-xs text-gray-600">
        Draft mode: <span className="font-mono">{wizard.draft.mode}</span> •
        version: <span className="font-mono">{wizard.draft.version}</span>
      </div>
    </div>
  );
}
