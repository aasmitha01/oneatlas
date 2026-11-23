
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  X,
  Search,
  Trophy,
  CheckCircle2,
  Plus,
} from "lucide-react";

type Pricing = {
  inputPricePerMillion: number;
  outputPricePerMillion: number;
};

type Benchmark = {
  benchmarkName: string;
  score: number;
  scoreUnit?: string | null;
};

type Model = {
  id: string;
  name: string;
  slug: string;
  modelType: string;
  contextWindow: number;
  capabilities: string[];
  inputModalities: string[];
  outputModalities: string[];
  company: { name: string } | null;
  providers: {
    provider: { name: string };
    pricing: Pricing[];
  }[];
  benchmarks: Benchmark[];
};

type ComparisonRow = {
  label: string;
  values: string[];
  bestIndex?: number;
  bestText?: string;
};

function getBestPriceIndex(models: Model[], type: "input" | "output") {
  const prices = models.map((model) => {
    const values = model.providers.flatMap((provider) =>
      provider.pricing.map((price) =>
        type === "input"
          ? price.inputPricePerMillion
          : price.outputPricePerMillion
      )
    );

    return values.length ? Math.min(...values) : null;
  });

  const available = prices.filter(
    (price): price is number => price !== null
  );

  if (!available.length) return -1;

  const lowest = Math.min(...available);
  return prices.findIndex((price) => price === lowest);
}

function formatPrice(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "—";
  return `$${value.toFixed(4)}`;
}

function getLowestPrice(model: Model, type: "input" | "output") {
  const prices = model.providers.flatMap((provider) =>
    provider.pricing.map((price) =>
      type === "input"
        ? price.inputPricePerMillion
        : price.outputPricePerMillion
    )
  );

  return prices.length ? Math.min(...prices) : null;
}

export default function ComparePage() {
  const [all, setAll] = useState<Model[]>([]);
  const [chosen, setChosen] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("models")?.split(",").filter(Boolean) || [];

    setChosen(initial.slice(0, 3));

    let active = true;

    async function loadModels() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/models?limit=50");

        if (!response.ok) {
          throw new Error("Failed to load models");
        }

        const result = await response.json();

        if (!result.data) {
          throw new Error(result.error || "Unable to load model data");
        }

        if (active) setAll(result.data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Something went wrong"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadModels();

    return () => {
      active = false;
    };
  }, []);

  const selected = useMemo(
    () =>
      chosen
        .map((slug) => all.find((model) => model.slug === slug))
        .filter((model): model is Model => Boolean(model)),
    [chosen, all]
  );

  const availableModels = all.filter((model) =>
    model.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const toggleModel = (slug: string) => {
    setChosen((previous) => {
      if (previous.includes(slug)) {
        return previous.filter((item) => item !== slug);
      }

      if (previous.length >= 3) return previous;

      return [...previous, slug];
    });
  };

  const benchmarkNames = Array.from(
    new Set(
      selected.flatMap((model) =>
        model.benchmarks.map((benchmark) => benchmark.benchmarkName)
      )
    )
  ).sort();

  const rows: ComparisonRow[] = [
    {
      label: "Company",
      values: selected.map((model) => model.company?.name || "Independent"),
    },
    {
      label: "Model type",
      values: selected.map((model) => model.modelType || "—"),
    },
    {
      label: "Context window",
      values: selected.map((model) =>
        model.contextWindow
          ? model.contextWindow.toLocaleString()
          : "—"
      ),
    },
    {
      label: "Input price / 1M tokens",
      values: selected.map((model) =>
        formatPrice(getLowestPrice(model, "input"))
      ),
      bestIndex: getBestPriceIndex(selected, "input"),
      bestText: "Lowest price",
    },
    {
      label: "Output price / 1M tokens",
      values: selected.map((model) =>
        formatPrice(getLowestPrice(model, "output"))
      ),
      bestIndex: getBestPriceIndex(selected, "output"),
      bestText: "Lowest price",
    },
    {
      label: "Available providers",
      values: selected.map((model) => {
        const names = model.providers
          .map((provider) => provider.provider.name)
          .filter(Boolean);

        return names.length ? names.join(", ") : "—";
      }),
    },
    {
      label: "Input modalities",
      values: selected.map((model) =>
        model.inputModalities?.length
          ? model.inputModalities.join(", ")
          : "—"
      ),
    },
    {
      label: "Output modalities",
      values: selected.map((model) =>
        model.outputModalities?.length
          ? model.outputModalities.join(", ")
          : "—"
      ),
    },
    {
      label: "Capabilities",
      values: selected.map((model) =>
        model.capabilities?.length
          ? model.capabilities.join(", ")
          : "—"
      ),
    },
  ];

  const benchmarkRows: ComparisonRow[] = benchmarkNames.map((name) => {
    const scores = selected.map((model) => {
      const benchmark = model.benchmarks.find(
        (item) => item.benchmarkName === name
      );

      return benchmark?.score ?? null;
    });

    const availableScores = scores.filter(
      (score): score is number => score !== null
    );

    const bestScore = availableScores.length
      ? Math.max(...availableScores)
      : null;

    return {
      label: name,
      values: scores.map((score) =>
        score === null ? "—" : score.toFixed(2)
      ),
      bestIndex:
        bestScore === null
          ? -1
          : scores.findIndex((score) => score === bestScore),
      bestText: "Highest score",
    };
  });

  const allRows = [...rows, ...benchmarkRows];

  return (
    <div>
      {/* HEADER */}
      <div className="mb-7">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-600">
          <ArrowLeftRight size={14} />
          Evaluation workspace
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Compare models<span className="text-violet-600">.</span>
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Compare AI models across performance, pricing, providers and
          technical specifications.
        </p>
      </div>

      {/* MODEL SELECTOR */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Select models
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Choose up to three models for side-by-side comparison.
            </p>
          </div>

          <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
            {selected.length} / 3 selected
          </span>
        </div>

        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search AI models..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {loading ? (
          <p className="py-5 text-center text-sm text-slate-400">
            Loading available models...
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableModels.map((model) => {
              const isSelected = chosen.includes(model.slug);
              const disabled = !isSelected && chosen.length >= 3;

              return (
                <button
                  key={model.id}
                  disabled={disabled}
                  onClick={() => toggleModel(model.slug)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-medium transition ${
                    isSelected
                      ? "border-violet-300 bg-violet-50 text-violet-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50/50"
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {isSelected ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Plus size={14} />
                  )}
                  {model.name}
                </button>
              );
            })}

            {availableModels.length === 0 && (
              <p className="py-3 text-xs text-slate-400">
                No models match your search.
              </p>
            )}
          </div>
        )}

        {selected.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {selected.map((model) => (
              <span
                key={model.id}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700"
              >
                {model.name}
                <button
                  onClick={() => toggleModel(model.slug)}
                  aria-label={`Remove ${model.name}`}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {error}. Please check your database and model API.
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && selected.length === 0 && !error && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <ArrowLeftRight
            className="mx-auto mb-3 text-violet-600"
            size={28}
          />

          <h2 className="font-semibold text-slate-800">
            Choose models to compare
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Select at least one model above to start comparing.
          </p>

          <Link
            href="/models"
            className="mt-4 inline-block text-xs font-semibold text-violet-700 hover:text-violet-900"
          >
            Browse model catalogue →
          </Link>
        </div>
      )}

      {/* COMPARISON */}
      {selected.length > 0 && (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Comparison results
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {selected.length} model{selected.length > 1 ? "s" : ""} selected
              </p>
            </div>

            <button
              onClick={() => setChosen([])}
              className="text-xs font-semibold text-slate-500 hover:text-red-500"
            >
              Clear selection
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <div
              className="grid min-w-[650px]"
              style={{
                gridTemplateColumns: `190px repeat(${selected.length}, minmax(190px, 1fr))`,
              }}
            >
              {/* TABLE HEADER */}
              <div className="border-b border-slate-100 bg-slate-50 p-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Specification
              </div>

              {selected.map((model) => (
                <div
                  key={model.id}
                  className="border-b border-l border-slate-100 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {model.name}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {model.company?.name || "Independent lab"}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleModel(model.slug)}
                      aria-label={`Remove ${model.name}`}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <Link
                    href={`/models/${model.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-violet-700 hover:text-violet-900"
                  >
                    View details
                    <ArrowLeftRight size={11} />
                  </Link>
                </div>
              ))}

              {/* GENERAL SPECIFICATIONS */}
              <div
                className="col-span-full border-b border-slate-100 bg-violet-50/60 px-4 py-3 text-xs font-bold uppercase tracking-wider text-violet-700"
                style={{ gridColumn: "1 / -1" }}
              >
                Model specifications
              </div>

              {rows.map((row) => (
                <div key={row.label} className="contents">
                  <div className="border-b border-slate-100 bg-slate-50/70 p-4 text-xs font-semibold text-slate-600">
                    {row.label}
                  </div>

                  {row.values.map((value, index) => {
                    const isBest =
                      row.bestIndex !== undefined &&
                      row.bestIndex >= 0 &&
                      row.bestIndex === index &&
                      value !== "—";

                    return (
                      <div
                        key={`${row.label}-${selected[index].id}`}
                        className={`border-b border-l border-slate-100 p-4 text-xs leading-5 ${
                          isBest
                            ? "bg-emerald-50/60 font-semibold text-emerald-800"
                            : "text-slate-700"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span>{value}</span>
                          {isBest && (
                            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">
                              {row.bestText || "Best"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* BENCHMARKS */}
              <div
                className="border-b border-slate-100 bg-violet-50/60 px-4 py-3 text-xs font-bold uppercase tracking-wider text-violet-700"
                style={{ gridColumn: "1 / -1" }}
              >
                Benchmark performance
              </div>

              {benchmarkRows.map((row) => (
                <div key={row.label} className="contents">
                  <div className="border-b border-slate-100 bg-slate-50/70 p-4 text-xs font-semibold text-slate-600">
                    {row.label}
                  </div>

                  {row.values.map((value, index) => {
                    const isBest =
                      row.bestIndex !== undefined &&
                      row.bestIndex >= 0 &&
                      row.bestIndex === index &&
                      value !== "—";

                    const numericValue = Number(value);
                    const percentage = Number.isFinite(numericValue)
                      ? Math.max(0, Math.min(100, numericValue))
                      : 0;

                    return (
                      <div
                        key={`${row.label}-${selected[index].id}`}
                        className="border-b border-l border-slate-100 p-4"
                      >
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`text-sm font-bold ${
                              isBest
                                ? "text-emerald-700"
                                : "text-slate-700"
                            }`}
                          >
                            {value}
                          </span>

                          {isBest && (
                            <Trophy
                              size={13}
                              className="text-emerald-600"
                            />
                          )}
                        </div>

                        {value !== "—" && (
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isBest
                                  ? "bg-emerald-500"
                                  : "bg-gradient-to-r from-violet-500 to-indigo-400"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="bg-amber-50 px-4 py-3 text-[10px] leading-5 text-amber-800">
              Pricing and benchmark values are based on the records in your
              OneAtlas database. Demo values are illustrative, not verified
              live provider prices or independently measured results.
              Lowest pricing is calculated from the available provider
              records for each model.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
