// src/features/listingWizard/steps/ListingDetailsStep.tsx
import * as React from "react";
import type { StepProps } from "@/listingWizard/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle>Listing details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
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
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
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
          <Label htmlFor="condition">Condition</Label>
          <Select
            value={ld.condition ?? ""}
            onValueChange={(value) => setField("condition", value)}
          >
            <SelectTrigger id="condition">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NM">Near Mint</SelectItem>
              <SelectItem value="LP">Lightly Played</SelectItem>
              <SelectItem value="MP">Moderately Played</SelectItem>
              <SelectItem value="HP">Heavily Played</SelectItem>
              <SelectItem value="DMG">Damaged</SelectItem>
            </SelectContent>
          </Select>
          {errors["listingDetails.condition"] && (
            <p className="text-sm text-red-600">
              {errors["listingDetails.condition"]}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="graded"
            checked={!!ld.graded}
            onCheckedChange={(checked) => setField("graded", checked)}
          />
          <Label htmlFor="graded">Graded</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="images">Images (IDs)</Label>
          <Input
            id="images"
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
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            className="min-h-[120px]"
            value={ld.description ?? ""}
            onChange={(e) => setField("description", e.target.value)}
          />
          {errors["listingDetails.description"] && (
            <p className="text-sm text-red-600">
              {errors["listingDetails.description"]}
            </p>
          )}
        </div>

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
