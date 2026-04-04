// src/app/listingWizard/steps/FranchiseStep.tsx
import type { Franchise, StepProps } from "@/listingWizard/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle>Choose a franchise</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Button
            type="button"
            variant={franchise === "pokemon" ? "default" : "outline"}
            className="flex-1"
            onClick={() => select("pokemon")}
          >
            Pokémon
          </Button>
          <Button
            type="button"
            variant={franchise === "yugioh" ? "default" : "outline"}
            className="flex-1"
            onClick={() => select("yugioh")}
          >
            Yu-Gi-Oh!
          </Button>
        </div>

        {errors["franchise"] && (
          <p className="text-sm text-red-600">{errors["franchise"]}</p>
        )}

        <div className="flex w-full pt-4">
          <Button className="ml-auto" onClick={goNext}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
