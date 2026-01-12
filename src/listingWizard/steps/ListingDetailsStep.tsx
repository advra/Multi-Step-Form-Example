// src/features/listingWizard/steps/ListingDetailsStep.tsx
import * as React from "react";
import type { StepProps } from "@/listingWizard/types";

export function ListingDetailsStep({
  draft,
  setDraft,
  errors,
  goNext,
  goBack,
}: Readonly<StepProps>) {
  const ld = draft.listingDetails ?? {};

  function setField<K extends keyof NonNullable<typeof draft.listingDetails>>(
    key: K,
    value: unknown
  ) {
    setDraft((prev) => ({
      ...prev,
      listingDetails: {
        ...prev.listingDetails,
        [key]: value,
      },
    }));
  }

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Listing details</div>

      <div className="space-y-2">
        <label className="block text-sm">Title</label>
        <input
          className="border rounded px-3 py-2 w-full"
          value={ld.title ?? ""}
          onChange={(e) => setField("title", e.target.value)}
        />
        {errors["listingDetails.title"] && (
          <p className="text-sm text-red-600">
            {errors["listingDetails.title"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Price</label>
        <input
          className="border rounded px-3 py-2 w-full"
          inputMode="decimal"
          value={ld.price ?? ""}
          onChange={(e) =>
            setField(
              "price",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
        />
        {errors["listingDetails.price"] && (
          <p className="text-sm text-red-600">
            {errors["listingDetails.price"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Condition</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={ld.condition ?? ""}
          onChange={(e) => setField("condition", e.target.value)}
        >
          <option value="">Select…</option>
          <option value="NM">Near Mint</option>
          <option value="LP">Lightly Played</option>
          <option value="MP">Moderately Played</option>
          <option value="HP">Heavily Played</option>
          <option value="DMG">Damaged</option>
        </select>
        {errors["listingDetails.condition"] && (
          <p className="text-sm text-red-600">
            {errors["listingDetails.condition"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!ld.graded}
            onChange={(e) => setField("graded", e.target.checked)}
          />
          Graded
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Images (IDs)</label>
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="comma-separated media IDs"
          value={(ld.images ?? []).join(",")}
          onChange={(e) =>
            setField(
              "images",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        />
        {errors["listingDetails.images"] && (
          <p className="text-sm text-red-600">
            {errors["listingDetails.images"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Description</label>
        <textarea
          className="border rounded px-3 py-2 w-full min-h-[120px]"
          value={ld.description ?? ""}
          onChange={(e) => setField("description", e.target.value)}
        />
        {errors["listingDetails.description"] && (
          <p className="text-sm text-red-600">
            {errors["listingDetails.description"]}
          </p>
        )}
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
          onClick={goNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
