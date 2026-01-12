// src/features/listingWizard/steps/CatalogSearchSelectStep.tsx
import * as React from "react";
import type { StepProps } from "@/listingWizard/types";
import {
  CatalogProvider,
  CatalogResult,
} from "@/listingWizard/providers/pokemonCardProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <Card>
      <CardHeader>
        <CardTitle>{provider.label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch(1);
            }}
          />
          <Button type="button" onClick={() => runSearch(1)} disabled={loading}>
            Search
          </Button>
        </div>

        {loading && <div className="text-sm">Loading…</div>}

        <Card>
          <ScrollArea className="h-[300px]">
            {results.length === 0 ? (
              <div className="p-3 text-sm text-gray-600">No results yet.</div>
            ) : (
              <ul className="divide-y">
                {results.map((r) => {
                  const active = r.id === selectedId;
                  return (
                    <li
                      key={r.id}
                      className="p-3 flex items-center justify-between gap-3 hover:bg-gray-50"
                    >
                      <div className="min-w-0">
                        <div
                          className={`truncate ${
                            active ? "font-semibold" : ""
                          }`}
                        >
                          {r.name}
                        </div>
                        {(r.setId || r.number) && (
                          <div className="text-xs text-gray-600">
                            {r.setId ?? ""} {r.number ? `#${r.number}` : ""}
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant={active ? "default" : "outline"}
                        size="sm"
                        onClick={() => selectItem(r)}
                      >
                        {active ? "Selected" : "Select"}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </ScrollArea>
        </Card>

        {hasMore && (
          <Button
            type="button"
            variant="outline"
            onClick={() => runSearch(page + 1)}
            disabled={loading}
          >
            Load more
          </Button>
        )}

        {errors["catalogSelection.catalogId"] && (
          <p className="text-sm text-red-600">
            {errors["catalogSelection.catalogId"]}
          </p>
        )}

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
