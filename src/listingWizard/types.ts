// src/listingWizard/types.ts
export type Franchise = "pokemon" | "yugioh";
export type ProductKind = "card" | "sealed";
export type ProductType = `${Franchise}:${ProductKind}`;

export type StepId =
  | "franchise"
  | "product"
  | "pokemonCardCatalog"
  | "yugiohCardCatalog"
  | "pokemonSealedCatalog"
  | "yugiohSealedCatalog"
  | "listingDetails"
  | "review";

export type WizardMode = "create" | "edit";

export type CatalogSelection = {
  catalogId?: string; // tcgdex card id or your internal sealed product id
  name?: string;
  setId?: string;
  number?: string;
  imageUrl?: string;
  meta?: Record<string, unknown>;
};

export type ListingDetails = {
  title?: string;
  price?: number;
  condition?: string;
  graded?: boolean;
  gradingCompany?: string;
  shipping?: {
    payer?: "buyer" | "seller";
    weightOz?: number;
    serviceToken?: string;
  };
  images?: string[]; // ideally Media IDs, not raw blob URLs
  description?: string;
};

export type ListingDraft = {
  version: 1;
  mode: WizardMode;

  franchise?: Franchise; // step1
  productType?: ProductType; // step2

  catalogSelection?: CatalogSelection; // step3

  listingDetails?: ListingDetails; // step4

  // branch-specific optional data (extend as needed)
  pokemonCard?: { language?: string; rarity?: string };
  yugiohCard?: { language?: string };
  pokemonSealed?: { language?: string };
  yugiohSealed?: { language?: string };
};

export type StepErrors = Record<string, string>;

export type StepProps = {
  draft: ListingDraft;
  setDraft: (updater: (prev: ListingDraft) => ListingDraft) => void;
  errors: StepErrors;
  goNext: () => void;
  goBack: () => void;
  goTo: (id: StepId) => void;
  validateAll?: () => boolean;
};

export type StepConfig = {
  id: StepId;
  title: string;

  when?: (draft: ListingDraft) => boolean;

  Component: React.ComponentType<StepProps>;

  // for Review mapping / grouping
  sectionKey?:
    | "franchise"
    | "product"
    | "catalog"
    | "listingDetails"
    | "review";

  // validate only what the step owns; return errors keyed by field path
  validate?: (
    draft: ListingDraft
  ) => { ok: true } | { ok: false; errors: StepErrors };
};
