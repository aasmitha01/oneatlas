
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Cpu,
  Eye,
  Layers3,
  CalendarDays,
  Building2,
  Globe,
  Trophy,
  Zap,
  ExternalLink,
} from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { compactNumber, money } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function formatDate(date: Date | null) {
  if (!date) return 'Not specified';

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

function ScoreBar({ score }: { score: number }) {
  const percentage = Math.max(0, Math.min(100, score));

  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default async function ModelDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let model: any = null;

  try {
    model = await prisma.aIModel.findUnique({
      where: { slug },
      include: {
        company: true,
        providers: {
          include: {
            provider: true,
            pricing: true,
          },
        },
        benchmarks: true,
      },
    });
  } catch (error) {
    console.error('Model detail error:', error);
  }

  if (!model) notFound();

  const capabilities: string[] = model.capabilities || [];
  const inputModalities: string[] = model.inputModalities || [];
  const outputModalities: string[] = model.outputModalities || [];
  const providers = model.providers || [];
  const benchmarks = model.benchmarks || [];

  const availableProviders = providers.filter(
    (provider: any) => provider.isAvailable
  ).length;

  return (
    <div>
      {/* BACK NAVIGATION */}
      <Link
        href="/models"
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-violet-700"
      >
        <ArrowLeft size={14} />
        Back to models
      </Link>

      {/* MODEL HERO */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-9">
        <div className="flex flex-col justify-between gap-6 lg:flex-row">
          <div className="flex gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-xl font-bold text-violet-700">
              {(model.company?.name || model.name)
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-violet-700">
                  {model.company?.name || 'Independent lab'}
                </span>

                <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700">
                  {model.modelType}
                </span>

                {model.featured && (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                    Featured model
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {model.name}
              </h1>

              {model.family && (
                <p className="mt-1 text-xs font-medium text-slate-400">
                  Model family: {model.family}
                </p>
              )}

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                {model.description ||
                  'No model description is currently available.'}
              </p>
            </div>
          </div>

          <div className="flex h-fit flex-wrap gap-2">
            <Link
              href={`/compare?models=${model.slug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50"
            >
              Compare model
            </Link>

            {model.company?.website && (
              <a
                href={model.company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-800"
              >
                Company website
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </div>

        {/* MODEL SPECIFICATIONS */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Context window',
              value: model.contextWindow
                ? compactNumber(model.contextWindow)
                : 'Not specified',
              icon: Layers3,
            },
            {
              label: 'Model type',
              value: model.modelType || 'Not specified',
              icon: Cpu,
            },
            {
              label: 'Input modalities',
              value: inputModalities.length
                ? inputModalities.join(', ')
                : 'Not specified',
              icon: Eye,
            },
            {
              label: 'Output modalities',
              value: outputModalities.length
                ? outputModalities.join(', ')
                : 'Not specified',
              icon: Code2,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl bg-slate-50 p-4"
            >
              <Icon size={17} className="mb-3 text-violet-600" />
              <p className="text-[10px] font-medium text-slate-400">
                {label}
              </p>
              <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ADDITIONAL INFORMATION */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
            <CalendarDays size={18} className="text-violet-600" />
            <div>
              <p className="text-[10px] text-slate-400">Release date</p>
              <p className="mt-1 text-xs font-semibold text-slate-700">
                {formatDate(model.releaseDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
            <Building2 size={18} className="text-violet-600" />
            <div>
              <p className="text-[10px] text-slate-400">Developed by</p>
              <p className="mt-1 text-xs font-semibold text-slate-700">
                {model.company?.name || 'Independent lab'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SUMMARY CARDS */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-violet-600">
            <Zap size={17} />
            <span className="text-xs font-semibold">Capabilities</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {capabilities.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Listed model capabilities
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-violet-600">
            <Globe size={17} />
            <span className="text-xs font-semibold">Providers</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {availableProviders}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Available provider integrations
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-violet-600">
            <Trophy size={17} />
            <span className="text-xs font-semibold">Benchmarks</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {benchmarks.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Available benchmark records
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        {/* LEFT COLUMN */}
        <div className="space-y-5">
          {/* CAPABILITIES */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Capabilities
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Declared capabilities in the OneAtlas catalogue.
            </p>

            {capabilities.length > 0 ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {capabilities.map((capability) => (
                  <div
                    key={capability}
                    className="flex items-center gap-2 rounded-xl bg-violet-50/70 px-3 py-3 text-sm font-medium text-violet-800"
                  >
                    <CheckCircle2 size={16} />
                    {capability}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-xl bg-slate-50 p-4 text-xs text-slate-400">
                No capabilities have been added for this model.
              </p>
            )}
          </section>

          {/* BENCHMARKS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Benchmark performance
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Recorded evaluation results for this model.
                </p>
              </div>

              <Trophy size={20} className="text-violet-600" />
            </div>

            {benchmarks.length > 0 ? (
              <div className="mt-5 space-y-4">
                {benchmarks.map((benchmark: any) => (
                  <div
                    key={benchmark.id}
                    className="rounded-xl border border-slate-100 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {benchmark.benchmarkName}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400">
                          Source: {benchmark.source || 'Not specified'}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-violet-700">
                          {benchmark.score}
                          {benchmark.scoreUnit
                            ? ` ${benchmark.scoreUnit}`
                            : ''}
                        </p>
                        <p className="text-[9px] text-slate-400">
                          Recorded score
                        </p>
                      </div>
                    </div>

                    <ScoreBar score={benchmark.score} />

                    {benchmark.evaluatedAt && (
                      <p className="mt-2 text-[10px] text-slate-400">
                        Evaluated: {formatDate(benchmark.evaluatedAt)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-xl bg-slate-50 p-4 text-xs text-slate-400">
                No benchmark data is currently available.
              </p>
            )}

            <p className="mt-4 text-[10px] leading-5 text-slate-400">
              Benchmark bars use a 0–100 visual scale. Scores outside this
              range are capped for display; the original recorded score
              remains visible.
            </p>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          {/* PROVIDERS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Available providers
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Platforms offering access to this model.
            </p>

            <div className="mt-5 space-y-4">
              {providers.map((provider: any) => (
                <div
                  key={provider.id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <b className="text-sm text-slate-800">
                      {provider.provider.name}
                    </b>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        provider.isAvailable
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {provider.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  {provider.provider.website && (
                    <a
                      href={provider.provider.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-violet-700 hover:text-violet-900"
                    >
                      Provider website
                      <ExternalLink size={11} />
                    </a>
                  )}

                  {provider.providerModelId && (
                    <p className="mt-2 text-[10px] text-slate-400">
                      Provider model ID: {provider.providerModelId}
                    </p>
                  )}

                  {provider.pricing.length > 0 ? (
                    provider.pricing.map((price: any) => (
                      <div
                        key={price.id}
                        className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3"
                      >
                        <div>
                          <p className="text-[10px] text-slate-400">
                            Input / 1M tokens
                          </p>
                          <b className="mt-1 block text-sm text-slate-800">
                            {money(Number(price.inputPricePerMillion))}
                          </b>
                        </div>

                        <div>
                          <p className="text-[10px] text-slate-400">
                            Output / 1M tokens
                          </p>
                          <b className="mt-1 block text-sm text-slate-800">
                            {money(Number(price.outputPricePerMillion))}
                          </b>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="mt-3 text-[10px] text-slate-400">
                      Pricing information not available.
                    </p>
                  )}
                </div>
              ))}

              {providers.length === 0 && (
                <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-400">
                  No provider integrations have been added for this model.
                </p>
              )}
            </div>
          </section>

          {/* QUICK ACTION */}
          <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-5">
            <h2 className="font-bold text-slate-900">
              Explore this model
            </h2>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Compare its specifications, pricing and benchmark records
              against other AI models in OneAtlas.
            </p>

            <Link
              href={`/compare?models=${model.slug}`}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-xs font-semibold text-white transition hover:bg-violet-700"
            >
              <Code2 size={15} />
              Compare with other models
            </Link>

            <Link
              href="/rankings"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-3 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              <Trophy size={15} />
              View model rankings
            </Link>
          </section>
        </div>
      </div>

      {/* DATA DISCLAIMER */}
      <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-[10px] leading-5 text-amber-800">
        Pricing and benchmark values in this starter dataset are illustrative
        demo values, not verified live provider quotes or independently
        measured performance results. Check provider documentation before
        making purchasing decisions.
      </div>
    </div>
  );
}
