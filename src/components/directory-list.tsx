
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Building2,
  Workflow,
  Trophy,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

type ProviderLink = {
  provider?: {
    id: string;
    name: string;
  };
};

type Entry = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  website?: string | null;
  _count?: { models: number };
  company?: { name: string } | null;
  score?: number;
  contextWindow?: number;
  modelType?: string;
  providers?: ProviderLink[];
};

export function DirectoryList({
  kind,
}: {
  kind: 'providers' | 'companies' | 'rankings';
}) {
  const [data, setData] = useState<Entry[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score-desc');

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`/api/${kind}`);

        if (!response.ok) {
          throw new Error('Could not load directory data');
        }

        const result = await response.json();

        if (!result.data) {
          throw new Error(result.error || 'Could not load data');
        }

        if (active) {
          setData(result.data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : 'Something went wrong'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [kind]);

  const title =
    kind === 'providers'
      ? 'Provider ecosystem'
      : kind === 'companies'
        ? 'AI labs & companies'
        : 'Model rankings';

  const subtitle =
    kind === 'providers'
      ? 'Explore platforms that provide access to AI models.'
      : kind === 'companies'
        ? 'Discover the companies and research labs building AI.'
        : 'Explore the leaderboard and compare AI model benchmark scores.';

  const Icon =
    kind === 'providers'
      ? Workflow
      : kind === 'companies'
        ? Building2
        : Trophy;

  const companies = useMemo(
    () =>
      Array.from(
        new Set(data.map((item) => item.company?.name).filter(Boolean))
      ).sort() as string[],
    [data]
  );

  const providers = useMemo(
    () =>
      Array.from(
        new Set(
          data.flatMap((item) =>
            item.providers?.map((link) => link.provider?.name).filter(Boolean) ?? []
          )
        )
      ).sort() as string[],
    [data]
  );

  const modelTypes = useMemo(
    () =>
      Array.from(
        new Set(data.map((item) => item.modelType).filter(Boolean))
      ).sort() as string[],
    [data]
  );

  const filteredData = useMemo(() => {
    let result = [...data];

    if (kind === 'rankings') {
      const query = search.trim().toLowerCase();

      if (query) {
        result = result.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.company?.name.toLowerCase().includes(query)
        );
      }

      if (companyFilter !== 'all') {
        result = result.filter(
          (item) => item.company?.name === companyFilter
        );
      }

      if (providerFilter !== 'all') {
        result = result.filter((item) =>
          item.providers?.some(
            (link) => link.provider?.name === providerFilter
          )
        );
      }

      if (typeFilter !== 'all') {
        result = result.filter(
          (item) => item.modelType === typeFilter
        );
      }

      result.sort((a, b) => {
        if (sortBy === 'score-asc') {
          return (a.score ?? 0) - (b.score ?? 0);
        }

        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }

        return (b.score ?? 0) - (a.score ?? 0);
      });
    }

    return result;
  }, [
    data,
    kind,
    search,
    companyFilter,
    providerFilter,
    typeFilter,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearch('');
    setCompanyFilter('all');
    setProviderFilter('all');
    setTypeFilter('all');
    setSortBy('score-desc');
  };

  const hasActiveFilters =
    search !== '' ||
    companyFilter !== 'all' ||
    providerFilter !== 'all' ||
    typeFilter !== 'all' ||
    sortBy !== 'score-desc';

  return (
    <div>
      <div className="mb-7">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-600">
          <Icon size={14} />
          {kind === 'rankings'
            ? 'Performance intelligence'
            : 'AI ecosystem'}
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          {title}
          <span className="text-violet-600">.</span>
        </h1>

        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          {error}. Check your database connection and seed data.
        </div>
      ) : loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
          <p className="text-sm text-slate-500">Loading {title.toLowerCase()}...</p>
        </div>
      ) : kind === 'rankings' ? (
        <>
          {/* Ranking filters */}
          <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <SlidersHorizontal size={16} className="text-violet-600" />
                Search & filters
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900"
                >
                  <X size={13} />
                  Clear filters
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <div className="relative sm:col-span-2 xl:col-span-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search models..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              >
                <option value="all">All companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>

              <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              >
                <option value="all">All providers</option>
                {providers.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              >
                <option value="all">All model types</option>
                {modelTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              >
                <option value="score-desc">Highest score</option>
                <option value="score-asc">Lowest score</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Showing {filteredData.length} of {data.length} models
            </p>
          </div>

          {/* Rankings list */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="hidden grid-cols-[50px_1fr_180px_100px] gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 md:grid">
              <span>Rank</span>
              <span>Model</span>
              <span>Performance</span>
              <span className="text-right">Score</span>
            </div>

            {filteredData.map((m, i) => {
              const score = Math.max(0, Math.min(100, m.score ?? 0));

              return (
                <div
                  key={m.id}
                  className="grid grid-cols-[38px_1fr_75px] items-center gap-3 border-b border-slate-100 p-4 last:border-0 hover:bg-violet-50/30 md:grid-cols-[50px_1fr_180px_100px] md:gap-4 md:px-5"
                >
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-xl text-xs font-bold ${
                      i === 0
                        ? 'bg-amber-100 text-amber-700'
                        : i === 1
                          ? 'bg-slate-200 text-slate-700'
                          : i === 2
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    #{i + 1}
                  </span>

                  <div className="min-w-0">
                    <Link
                      href={`/models/${m.slug}`}
                      className="text-sm font-semibold hover:text-violet-700"
                    >
                      {m.name}
                    </Link>

                    <p className="mt-1 truncate text-[10px] text-slate-400">
                      {m.company?.name || 'Independent lab'}
                      {' · '}
                      {m.modelType || 'AI model'}
                      {m.contextWindow
                        ? ` · ${m.contextWindow.toLocaleString()} context`
                        : ''}
                    </p>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 md:hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-500"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <div className="mb-1 flex justify-between text-[10px] text-slate-400">
                      <span>Performance</span>
                      <span>{score.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all duration-500"
style={{
  width: `${score}%`,
  minWidth: score > 0 ? '3px' : '0px',
  background: 'linear-gradient(90deg, #7c3aed 0%, #818cf8 100%)',
}}
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <b className="text-lg text-violet-700">
                      {m.score != null ? m.score.toFixed(1) : '—'}
                    </b>
                    <small className="ml-1 text-[9px] font-normal text-slate-400">
                      score
                    </small>
                  </div>
                </div>
              );
            })}

            {filteredData.length === 0 && (
              <div className="p-10 text-center">
                <Search className="mx-auto mb-3 text-slate-300" size={24} />
                <p className="text-sm font-semibold text-slate-700">
                  No matching models found
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Try changing your search or filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-lg bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          <p className="mt-3 text-[10px] leading-5 text-slate-400">
            Scores are based on the benchmark records currently stored in your
            OneAtlas database. Demo benchmark values are illustrative, not
            independently verified performance measurements.
          </p>
        </>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-sm font-bold text-violet-700">
                  {item.name.slice(0, 2).toUpperCase()}
                </span>

                <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] text-slate-500">
                  {item._count?.models ?? 0} models
                </span>
              </div>

              <h2 className="font-semibold">{item.name}</h2>

              <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">
                {item.description ||
                  'Explore supported models and integrations.'}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                {item.website ? (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700"
                  >
                    Official website <ArrowUpRight size={13} />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">
                    OneAtlas directory
                  </span>
                )}

                <span className="text-[10px] text-slate-400">
                  Directory listing
                </span>
              </div>
            </article>
          ))}

          {data.length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              No entries found. Seed your database to populate this directory.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
