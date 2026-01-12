// src/features/listingWizard/wizard/stepConfigs.tsx
import type {
  ListingDraft,
  StepConfig,
  StepProps,
} from "@/listingWizard/types";
import { FranchiseStep } from "@/listingWizard/steps/FranchiseStep";
import {
  catalogSelectionSchema,
  franchiseSchema,
  listingDetailsSchema,
  productSchema,
  validateSlice,
} from "@/listingWizard/schemas";
import { ProductStep } from "@/listingWizard/steps/ProductStep";
import { CatalogSearchSelectStep } from "@/listingWizard/steps/CatalogSearchSelectStep";
import { pokemonCardProvider } from "@/listingWizard/providers/pokemonCardProvider";
import { yugiohCardProvider } from "@/listingWizard/providers/yugiohCardProvider";
import { pokemonSealedProvider } from "@/listingWizard/providers/pokemonSealedProvider";
import { yugiohSealedProvider } from "@/listingWizard/providers/yugiohSealedProvider";
import { ListingDetailsStep } from "@/listingWizard/steps/ListingDetailsStep";
import { ReviewStep } from "@/listingWizard/steps/ReviewStep";

const hasFranchise = (d: ListingDraft) => !!d.franchise;
const hasProduct = (d: ListingDraft) => !!d.productType;
const hasCatalog = (d: ListingDraft) => !!d.catalogSelection?.catalogId;

export const stepConfigs: StepConfig[] = [
  {
    id: "franchise",
    title: "Select Franchise",
    sectionKey: "franchise",
    Component: FranchiseStep,
    validate: (d) => validateSlice(franchiseSchema, d),
  },
  {
    id: "product",
    title: "Select Product Type",
    sectionKey: "product",
    when: hasFranchise,
    Component: ProductStep,
    validate: (d) => validateSlice(productSchema, d),
  },

  // 4 catalog steps (same UI component, different provider)
  {
    id: "pokemonCardCatalog",
    title: "Find Pokémon Card",
    sectionKey: "catalog",
    when: (d) => d.productType === "pokemon:card",
    Component: (props) => (
      <CatalogSearchSelectStep {...props} provider={pokemonCardProvider} />
    ),
    validate: (d) => validateSlice(catalogSelectionSchema, d),
  },
  {
    id: "yugiohCardCatalog",
    title: "Find Yu-Gi-Oh! Card",
    sectionKey: "catalog",
    when: (d) => d.productType === "yugioh:card",
    Component: (props) => (
      <CatalogSearchSelectStep {...props} provider={yugiohCardProvider} />
    ),
    validate: (d) => validateSlice(catalogSelectionSchema, d),
  },
  {
    id: "pokemonSealedCatalog",
    title: "Find Pokémon Sealed Product",
    sectionKey: "catalog",
    when: (d) => d.productType === "pokemon:sealed",
    Component: (props) => (
      <CatalogSearchSelectStep {...props} provider={pokemonSealedProvider} />
    ),
    validate: (d) => validateSlice(catalogSelectionSchema, d),
  },
  {
    id: "yugiohSealedCatalog",
    title: "Find Yu-Gi-Oh! Sealed Product",
    sectionKey: "catalog",
    when: (d) => d.productType === "yugioh:sealed",
    Component: (props) => (
      <CatalogSearchSelectStep {...props} provider={yugiohSealedProvider} />
    ),
    validate: (d) => validateSlice(catalogSelectionSchema, d),
  },

  {
    id: "listingDetails",
    title: "Listing Details",
    sectionKey: "listingDetails",
    when: (d) => hasProduct(d) && hasCatalog(d),
    Component: ListingDetailsStep,
    validate: (d) => validateSlice(listingDetailsSchema, d),
  },

  {
    id: "review",
    title: "Review & Submit",
    sectionKey: "review",
    when: (d) => hasProduct(d), // you can make this stricter if you want
    Component: ReviewStep,
  },
];
