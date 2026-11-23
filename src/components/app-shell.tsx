
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlobalSearch } from '@/components/global-search';

import {
  Activity,
  ArrowLeftRight,
  Building2,
  BrainCircuit,
  Gauge,
  LayoutDashboard,
  Search,
  Workflow,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const links = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/models', label: 'Explore models', icon: Search },
  { href: '/compare', label: 'Compare models', icon: ArrowLeftRight },
  { href: '/rankings', label: 'Rankings', icon: Gauge },
  { href: '/providers', label: 'Providers', icon: Workflow },
  { href: '/companies', label: 'AI labs', icon: Building2 },
];

function LogoMark({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl text-white ${
        small ? 'h-9 w-9 rounded-xl' : 'h-12 w-12'
      }`}
      style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 55%, #312e81 100%)',
        boxShadow: '0 7px 18px rgba(99, 72, 220, 0.25)',
      }}
    >
      <BrainCircuit size={small ? 21 : 27} strokeWidth={2.1} />
    </div>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <LogoMark />

      <div className="min-w-0">
        <div className="text-[21px] font-extrabold tracking-tight text-slate-950">
          oneatlas<span className="text-violet-600">.</span>
        </div>

        <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
          AI Intelligence
        </div>
      </div>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const currentPage =
    links.find(
      (link) =>
        link.href === pathname ||
        (link.href !== '/' && pathname.startsWith(link.href))
    )?.label || 'Model details';

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">

      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-slate-200/80 bg-white px-5 py-6 lg:flex">

        {/* BRAND LOGO */}
        <div className="mb-10 px-1">
          <Brand />
        </div>

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </p>

        {/* NAVIGATION */}
        <nav className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== '/' && pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={active ? 2.3 : 1.8}
                  className={active ? 'text-violet-600' : ''}
                />

                <span>{label}</span>

                {label === 'Explore models' && (
                  <span className="ml-auto rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-semibold text-violet-600">
                    NEW
                  </span>
                )}

                {active && (
                  <ChevronRight
                    size={15}
                    className="ml-auto text-violet-400"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ATLAS PROMOTION CARD */}
        <div className="mt-auto overflow-hidden rounded-2xl p-4 text-white"
          style={{
            background: 'linear-gradient(145deg, #17152f, #31256b)',
          }}
        >
          <div className="mb-3 flex items-center gap-2 text-violet-200">
            <Activity size={17} />
            <span className="text-xs font-semibold">
              Atlas intelligence
            </span>
          </div>

          <h3 className="text-sm font-bold">
            Find the right model, faster.
          </h3>

          <p className="mt-2 text-xs leading-5 text-violet-100/75">
            Explore capabilities, compare costs and evaluate performance.
          </p>

          <Link
  href="/models"
  className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition hover:bg-violet-50"
  style={{
    backgroundColor: '#ffffff',
    color: '#5b21b6',
  }}
>
  <span style={{ color: '#5b21b6' }}>Explore models</span>
  <ChevronRight size={14} color="#5b21b6" />
</Link>
        </div>

        {/* WORKSPACE PROFILE */}
        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4338ca)',
            }}
          >
            OA
          </div>

          <div>
            <p className="text-xs font-bold text-slate-900">
              OneAtlas Workspace
            </p>
            <p className="text-[10px] text-slate-400">
              Developer preview
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="lg:pl-[260px]">

        {/* HEADER */}
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 backdrop-blur-xl md:px-9">

          {/* MOBILE BRAND */}
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <LogoMark small />

            <span className="text-lg font-extrabold tracking-tight text-slate-950">
              oneatlas<span className="text-violet-600">.</span>
            </span>
          </Link>

          {/* BREADCRUMB */}
          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Model intelligence workspace</span>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-700">
              {currentPage}
            </span>
          </div>

{/* HEADER ACTIONS */}
<div className="ml-auto flex items-center gap-2 sm:gap-3">
  <span className="hidden rounded-full border border-slate-200 px-3 py-2 text-[11px] text-slate-500 md:inline-flex">
    MVP · Demo dataset
  </span>

  <GlobalSearch />
</div>
</header>

        {/* PAGE CONTENT */}
        <main className="mx-auto min-h-[calc(100vh-150px)] w-full max-w-[1440px] px-4 py-6 sm:px-6 md:px-9 md:py-9">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="px-4 pb-24 text-center text-[11px] text-slate-400 lg:px-9 lg:pb-8">
          <span className="font-semibold text-slate-500">OneAtlas</span>
          {' '}· AI model discovery & intelligence ·
          Demo data is illustrative and should be independently verified.
        </footer>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-slate-200 bg-white/95 px-1 py-2 backdrop-blur-xl lg:hidden">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== '/' && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 py-1 text-[9px] font-medium transition ${
                active ? 'text-violet-700' : 'text-slate-400'
              }`}
            >
              <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
              <span className="truncate">
                {label === 'Explore models'
                  ? 'Explore'
                  : label === 'Compare models'
                  ? 'Compare'
                  : label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
