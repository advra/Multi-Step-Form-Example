// src/app/listingWizard/providers/pokemonCardProvider.ts
import type { CatalogSelection } from "../types";

export type CatalogResult = {
  id: string;
  name: string;
  setId?: string;
  number?: string;
  imageUrl?: string;
  raw?: unknown;
};

export type CatalogProvider = {
  id: string;
  label: string;
  search: (
    term: string,
    page: number,
    size: number
  ) => Promise<{ results: CatalogResult[]; hasMore: boolean }>;
  toSelection: (r: CatalogResult) => CatalogSelection;
};

// Replace with your real tcgdex calls
export const pokemonCardProvider: CatalogProvider = {
  id: "pokemonCard",
  label: "Pokémon Cards",
  async search(term, page, size) {
    // TODO: integrate tcgdex pagination or your own caching layer
    // return { results: await api.searchPokemonCards(term, page, size), hasMore: ... }
    return {
      results: [
        {
          id: `tcgdex:${term}:${page}`,
          name: `Example Pokémon Card: ${term}`,
          setId: "base",
          number: "1",
          imageUrl: "https://example.com/card.png",
        },
      ],
      hasMore: false,
    };
  },
  toSelection(r) {
    return {
      catalogId: r.id,
      name: r.name,
      setId: r.setId,
      number: r.number,
      imageUrl: r.imageUrl,
      meta: { raw: r.raw },
    };
  },
};
