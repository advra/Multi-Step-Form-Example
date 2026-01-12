// src/app/listingWizard/providers/yugiohSealedProvider.ts
import type { CatalogProvider } from "./pokemonCardProvider";

export const yugiohSealedProvider: CatalogProvider = {
  id: "yugiohSealed",
  label: "Yu-Gi-Oh! Sealed",
  async search(term, page, size) {
    return {
      results: [
        {
          id: `ygoseal:${term}:${page}`,
          name: `Example Yu-Gi-Oh! Sealed: ${term}`,
        },
      ],
      hasMore: false,
    };
  },
  toSelection(r) {
    return { catalogId: r.id, name: r.name };
  },
};
