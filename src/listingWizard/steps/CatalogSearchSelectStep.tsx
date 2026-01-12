// src/features/listingWizard/steps/CatalogSearchSelectStep.tsx
import * as React from "react";
import type { StepProps } from "@/listingWizard/types";
import {
  CatalogProvider,
  CatalogResult,
} from "@/listingWizard/providers/pokemonCardProvider";

type Props = StepProps & { provider: CatalogProvider };

export function CatalogSearchSelectStep({
  draft,
  setDraft,
  errors,
  goNext,
  goBack,
  provider,
}: Props) {
  const [term, setTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<CatalogResult[]>([]);
  const [hasMore, setHasMore] = React.useState(false);

  const selectedId = draft.catalogSelection?.catalogId;

  async function runSearch(nextPage = 1) {
    if (!term.trim()) return;
    setLoading(true);
    try {
      const res = await provider.search(term.trim(), nextPage, 10);
      setResults(nextPage === 1 ? res.results : [...results, ...res.results]);
      setHasMore(res.hasMore);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }

  function selectItem(item: CatalogResult) {
    const selection = provider.toSelection(item);
    setDraft((prev) => ({
      ...prev,
      catalogSelection: selection,
    }));
  }

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">{provider.label}</div>

      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Search…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") runSearch(1);
          }}
        />
        <button
          type="button"
          className="px-4 py-2 rounded bg-black text-white"
          onClick={() => runSearch(1)}
          disabled={loading}
        >
          Search
        </button>
      </div>

      {loading && <div className="text-sm">Loading…</div>}

      <div className="border rounded">
        {results.length === 0 ? (
          <div className="p-3 text-sm text-gray-600">No results yet.</div>
        ) : (
          <ul className="divide-y">
            {results.map((r) => {
              const active = r.id === selectedId;
              return (
                <li
                  key={r.id}
                  className="p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div
                      className={`truncate ${active ? "font-semibold" : ""}`}
                    >
                      {r.name}
                    </div>
                    {(r.setId || r.number) && (
                      <div className="text-xs text-gray-600">
                        {r.setId ?? ""} {r.number ? `#${r.number}` : ""}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded border ${
                      active ? "font-bold" : ""
                    }`}
                    onClick={() => selectItem(r)}
                  >
                    {active ? "Selected" : "Select"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {hasMore && (
        <button
          type="button"
          className="px-4 py-2 rounded border"
          onClick={() => runSearch(page + 1)}
          disabled={loading}
        >
          Load more
        </button>
      )}

      {errors["catalogSelection.catalogId"] && (
        <p className="text-sm text-red-600">
          {errors["catalogSelection.catalogId"]}
        </p>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          className="px-4 py-2 rounded border"
          onClick={goBack}
        >
          Back
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded bg-black text-white"
          onClick={goNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
