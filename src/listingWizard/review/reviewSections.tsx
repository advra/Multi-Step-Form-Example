// src/features/listingWizard/review/reviewSections.tsx
import type { ListingDraft, StepId } from "../types";

export type ReviewSection = {
  key: "franchise" | "product" | "catalog" | "listingDetails";
  title: string;
  isVisible: (draft: ListingDraft) => boolean;
  rows: (
    draft: ListingDraft
  ) => Array<{ label: string; value: React.ReactNode }>;
  editStepId: (draft: ListingDraft) => StepId;
};

function catalogStepFor(draft: ListingDraft): StepId {
  switch (draft.productType) {
    case "pokemon:card":
      return "pokemonCardCatalog";
    case "yugioh:card":
      return "yugiohCardCatalog";
    case "pokemon:sealed":
      return "pokemonSealedCatalog";
    case "yugioh:sealed":
      return "yugiohSealedCatalog";
    default:
      return "product";
  }
}

export const reviewSections: ReviewSection[] = [
  {
    key: "franchise",
    title: "Franchise",
    isVisible: (d) => !!d.franchise,
    rows: (d) => [{ label: "Franchise", value: d.franchise ?? "—" }],
    editStepId: () => "franchise",
  },
  {
    key: "product",
    title: "Product Type",
    isVisible: (d) => !!d.productType,
    rows: (d) => [{ label: "Product", value: d.productType ?? "—" }],
    editStepId: () => "product",
  },
  {
    key: "catalog",
    title: "Catalog Selection",
    isVisible: (d) => !!d.catalogSelection?.catalogId,
    rows: (d) => [
      { label: "Catalog ID", value: d.catalogSelection?.catalogId ?? "—" },
      { label: "Name", value: d.catalogSelection?.name ?? "—" },
      { label: "Set", value: d.catalogSelection?.setId ?? "—" },
      { label: "Number", value: d.catalogSelection?.number ?? "—" },
    ],
    editStepId: catalogStepFor,
  },
  {
    key: "listingDetails",
    title: "Listing Details",
    isVisible: (d) => !!d.listingDetails,
    rows: (d) => [
      { label: "Title", value: d.listingDetails?.title ?? "—" },
      { label: "Price", value: d.listingDetails?.price ?? "—" },
      { label: "Condition", value: d.listingDetails?.condition ?? "—" },
      { label: "Images", value: (d.listingDetails?.images ?? []).length },
    ],
    editStepId: () => "listingDetails",
  },
];
