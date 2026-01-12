// src/app/listingWizard/steps/ProductStep.tsx
import * as React from "react";
import type { ProductType, StepProps } from "@/listingWizard/types";

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
    <div className="space-y-4">
      <div className="text-lg font-semibold">Choose product type</div>

      <div className="flex gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`px-4 py-2 rounded border ${
              productType === opt.value ? "font-bold" : ""
            }`}
            onClick={() =>
              setDraft((prev) => ({ ...prev, productType: opt.value }))
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      {errors["productType"] && (
        <p className="text-sm text-red-600">{errors["productType"]}</p>
      )}

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
          onClick={goNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
