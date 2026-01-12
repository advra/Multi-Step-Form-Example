// src/features/listingWizard/steps/ReviewStep.tsx
import * as React from "react";
import type { StepProps } from "@/listingWizard/types";
import { reviewSections } from "@/listingWizard/review/reviewSections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
            <Card key={section.key}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => goTo(section.editStepId(draft))}
                >
                  Edit
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {section.rows(draft).map((row) => (
                  <div key={row.label} className="flex gap-2">
                    <div className="w-40 text-gray-600">{row.label}</div>
                    <div className="flex-1">{row.value}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={goBack}>
          Back
        </Button>

        <Button
          type="button"
          onClick={() => {
            const ok = validateAll?.();
            if (!ok) {
              // optionally jump to first invalid step, but simplest is to let errors show in steps
              return;
            }
            // TODO: submit to API
            alert("Submit: implement API call here");
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
