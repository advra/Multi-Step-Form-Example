// src/app/listingWizard/providers/pokemonSealedProvider.ts
import type { CatalogProvider } from "./pokemonCardProvider";

export const pokemonSealedProvider: CatalogProvider = {
  id: "pokemonSealed",
  label: "Pokémon Sealed",
  async search(term, page, size) {
    return {
      results: [
        {
          id: `pseal:${term}:${page}`,
          name: `Example Pokémon Sealed: ${term}`,
        },
      ],
      hasMore: false,
    };
  },
  toSelection(r) {
    return { catalogId: r.id, name: r.name };
  },
};
