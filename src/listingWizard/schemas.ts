// src/listingWizard/schemas.ts
import { z } from "zod";
import type { Franchise, ProductType, ListingDraft } from "./types";

export const franchiseSchema = z.object({
  franchise: z.enum(["pokemon", "yugioh"] satisfies Franchise[]),
});

export const productSchema = z.object({
  productType: z.enum([
    "pokemon:card",
    "pokemon:sealed",
    "yugioh:card",
    "yugioh:sealed",
  ] satisfies ProductType[]),
});

export const catalogSelectionSchema = z.object({
  catalogSelection: z.object({
    catalogId: z.string().min(1, "Select an item"),
    name: z.string().optional(),
    setId: z.string().optional(),
    number: z.string().optional(),
    imageUrl: z.url().optional(),
  }),
});

export const listingDetailsSchema = z.object({
  listingDetails: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    price: z.number().positive("Price must be > 0"),
    condition: z.string().min(1, "Condition is required"),
    graded: z.boolean().optional(),
    gradingCompany: z.string().optional(),
    shipping: z
      .object({
        payer: z.enum(["buyer", "seller"]),
        weightOz: z.number().positive().optional(),
        serviceToken: z.string().optional(),
      })
      .optional(),
    images: z.array(z.string()).min(1, "At least one image is required"),
    description: z.string().max(5000).optional(),
  }),
});

export const fullDraftSchema = z.object({
  version: z.literal(1),
  mode: z.enum(["create", "edit"]),
  franchise: z.enum(["pokemon", "yugioh"]),
  productType: z.enum([
    "pokemon:card",
    "pokemon:sealed",
    "yugioh:card",
    "yugioh:sealed",
  ]),
  catalogSelection: z.object({
    catalogId: z.string().min(1),
  }),
  listingDetails: listingDetailsSchema.shape.listingDetails,
});

export function zodErrorsToMap(
  result: z.ZodSafeParseResult<unknown>
): Record<string, string> {
  if (result.success) return {};
  const out: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".") || "form";
    // keep first error per path
    if (!out[path]) out[path] = issue.message;
  }
  return out;
}

export function validateSlice(
  schema: z.ZodTypeAny,
  draft: ListingDraft
) {
  const res = schema.safeParse(draft);
  if (res.success) return { ok: true as const };
  return { ok: false as const, errors: zodErrorsToMap(res) };
}
