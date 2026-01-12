// src/features/listingWizard/providers/yugiohCardProvider.ts
import type { CatalogProvider } from "./pokemonCardProvider";

export const yugiohCardProvider: CatalogProvider = {
  id: "yugiohCard",
  label: "Yu-Gi-Oh! Cards",
  async search(term, page, size) {
    return {
      results: [
        { id: `ygo:${term}:${page}`, name: `Example Yu-Gi-Oh! Card: ${term}` },
      ],
      hasMore: false,
    };
  },
  toSelection(r) {
    return { catalogId: r.id, name: r.name };
  },
};
