// src/features/listingWizard/steps/ReviewStep.tsx
import * as React from "react";
import type { StepProps } from "@/listingWizard/types";
import { reviewSections } from "@/listingWizard/review/reviewSections";

export function ReviewStep({
  draft,
  goBack,
  goTo,
  validateAll,
}: Readonly<StepProps>) {
  return (
    <div className="space-y-5">
      <div className="text-lg font-semibold">Review</div>

      <div className="space-y-4">
        {reviewSections
          .filter((s) => s.isVisible(draft))
          .map((section) => (
            <div key={section.key} className="border rounded p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{section.title}</div>
                <button
                  type="button"
                  className="text-sm underline"
                  onClick={() => goTo(section.editStepId(draft))}
                >
                  Edit
                </button>
              </div>

              <div className="text-sm space-y-1">
                {section.rows(draft).map((row) => (
                  <div key={row.label} className="flex gap-2">
                    <div className="w-40 text-gray-600">{row.label}</div>
                    <div className="flex-1">{row.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          className="px-4 py-2 rounded border"
          onClick={goBack}
        >
          Back
        </button>

        <button
          type="button"
          className="px-4 py-2 rounded bg-black text-white"
          onClick={() => {
            const ok = validateAll();
            if (!ok) {
              // optionally jump to first invalid step, but simplest is to let errors show in steps
              return;
            }
            // TODO: submit to API
            alert("Submit: implement API call here");
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
