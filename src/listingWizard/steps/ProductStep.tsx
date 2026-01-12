// src/app/listingWizard/steps/ProductStep.tsx
import * as React from "react";
import type { ProductType, StepProps } from "@/listingWizard/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductStep({
  draft,
  setDraft,
  errors,
  goNext,
  goBack,
}: Readonly<StepProps>) {
  const franchise = draft.franchise;
  const productType = draft.productType;

  if (!franchise) return null;

  const options: { label: string; value: ProductType }[] = [
    { label: `${franchise} card`, value: `${franchise}:card` },
    { label: `${franchise} sealed`, value: `${franchise}:sealed` },
  ] as never;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose product type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          {options.map((opt) => (
            <Button
              key={opt.value}
              type="button"
              variant={productType === opt.value ? "default" : "outline"}
              className="flex-1"
              onClick={() =>
                setDraft((prev) => ({ ...prev, productType: opt.value }))
              }
            >
              {opt.label}
            </Button>
          ))}
        </div>

        {errors["productType"] && (
          <p className="text-sm text-red-600">{errors["productType"]}</p>
        )}

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={goBack}>
            Back
          </Button>
          <Button type="button" onClick={goNext}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
