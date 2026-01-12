// src/app/listingWizard/steps/FranchiseStep.tsx
import type { Franchise, StepProps } from "@/listingWizard/types";

export function FranchiseStep({
  draft,
  setDraft,
  errors,
  goNext,
}: Readonly<StepProps>) {
  const franchise = draft.franchise;

  function select(val: Franchise) {
    setDraft((prev) => ({ ...prev, franchise: val }));
  }

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Choose a franchise</div>

      <div className="flex gap-3">
        <button
          type="button"
          className={`px-4 py-2 rounded border ${
            franchise === "pokemon" ? "font-bold" : ""
          }`}
          onClick={() => select("pokemon")}
        >
          Pokémon
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded border ${
            franchise === "yugioh" ? "font-bold" : ""
          }`}
          onClick={() => select("yugioh")}
        >
          Yu-Gi-Oh!
        </button>
      </div>

      {errors["franchise"] && (
        <p className="text-sm text-red-600">{errors["franchise"]}</p>
      )}

      <div className="pt-2">
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
