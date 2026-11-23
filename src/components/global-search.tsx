
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  BrainCircuit,
  Building2,
  Workflow,
  Loader2,
} from 'lucide-react';

type SearchResults = {
  models: {
    id: string;
    name: string;
    slug: string;
    modelType: string;
    company: { name: string } | null;
  }[];
  companies: {
    id: string;
    name: string;
    slug: string;
  }[];
  providers: {
    id: string;
    name: string;
    slug: string;
  }[];
};

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({
    models: [],
    companies: [],
    providers: [],
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const value = query.trim();

    if (value.length < 2) {
      setResults({ models: [], companies: [], providers: [] });
      setLoading(false);
      setError('');
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `/api/search?q=${encodeURIComponent(value)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Search is temporarily unavailable');
        }

        const result = await response.json();

        setResults(result.data);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
          setResults({ models: [], companies: [], providers: [] });
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const total =
    results.models.length +
    results.companies.length +
    results.providers.length;

  const closeSearch = () => {
    setOpen(false);
    setQuery('');
    setResults({ models: [], companies: [], providers: [] });
  };

  return (
    <div className="relative w-[min(52vw,360px)] sm:w-[320px]">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

    <input
  value={query}
  onChange={(event) => {
    setQuery(event.target.value);
    setOpen(true);
  }}
  onFocus={() => setOpen(true)}
  onKeyDown={(event) => {
    if (event.key === 'Escape') closeSearch();
  }}
  placeholder="Search models, companies, providers..."
  aria-label="Search models, companies and providers"
  style={{
    backgroundColor: '#ffffff',
    color: '#1e293b',
    WebkitTextFillColor: '#1e293b',
  }}
  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-xs font-medium outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
/>
        {loading ? (
          <Loader2
            size={15}
            className="absolute right-3 top-1/2 animate-spin text-violet-500"
          />
        ) : query ? (
          <button
            onClick={closeSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            <X size={15} />
          </button>
        ) : null}
      </div>

      {open && query.trim().length >= 2 && (
        <>
          <button
            aria-label="Close search results"
            className="fixed inset-0 z-30 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-full z-40 mt-2 max-h-[70vh] w-[min(90vw,380px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Searching OneAtlas...
              </div>
            ) : error ? (
              <div className="p-5 text-center text-xs text-red-500">
                {error}
              </div>
            ) : total === 0 ? (
              <div className="p-6 text-center">
                <Search
                  size={22}
                  className="mx-auto mb-2 text-slate-300"
                />
                <p className="text-sm font-semibold text-slate-700">
                  No results found
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Try another model, company or provider name.
                </p>
              </div>
            ) : (
              <>
                {results.models.length > 0 && (
                  <section>
                    <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      AI Models
                    </p>

                    {results.models.map((item) => (
                      <Link
                        key={item.id}
                        href={`/models/${item.slug}`}
                        onClick={closeSearch}
                        className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-violet-50"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700">
                          <BrainCircuit size={17} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-slate-800">
                            {item.name}
                          </span>
                          <span className="mt-1 block truncate text-[10px] text-slate-400">
                            {item.company?.name || 'Independent lab'} · {item.modelType}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </section>
                )}

                {results.companies.length > 0 && (
                  <section className="mt-2 border-t border-slate-100 pt-2">
                    <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Companies
                    </p>

                    {results.companies.map((item) => (
                      <Link
                        key={item.id}
                        href="/companies"
                        onClick={closeSearch}
                        className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-violet-50"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-700">
                          <Building2 size={17} />
                        </span>
                        <span className="text-xs font-semibold text-slate-800">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </section>
                )}

                {results.providers.length > 0 && (
                  <section className="mt-2 border-t border-slate-100 pt-2">
                    <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Providers
                    </p>

                    {results.providers.map((item) => (
                      <Link
                        key={item.id}
                        href="/providers"
                        onClick={closeSearch}
                        className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-violet-50"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700">
                          <Workflow size={17} />
                        </span>
                        <span className="text-xs font-semibold text-slate-800">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </section>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
