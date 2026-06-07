import { SearchBar } from '@/components/ui/SearchBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Zap, Layers, RefreshCw } from 'lucide-react';

const FEATURE_CARDS = [
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Cached data served in milliseconds. Live fallback when cache misses so you always get fresh stats.',
    color: 'text-yellow-400',
    border: 'border-yellow-500/20 hover:border-yellow-500/40',
    bg: 'bg-yellow-500/[0.04]',
    iconBg: 'border-yellow-500/25 bg-yellow-500/10',
    glow: 'hover:shadow-[0_0_24px_rgba(234,179,8,0.1)]',
  },
  {
    icon: Layers,
    title: 'Unified Profile',
    description: 'One search surface for every supported game. Valorant, CS2 and more — all in the same place.',
    color: 'text-accent',
    border: 'border-accent/20 hover:border-accent/40',
    bg: 'bg-accent/[0.04]',
    iconBg: 'border-accent/25 bg-accent/10',
    glow: 'hover:shadow-[0_0_24px_rgba(99,102,241,0.1)]',
  },
  {
    icon: RefreshCw,
    title: 'Always Updated',
    description: 'Stats refresh automatically after each session. You never look at stale numbers again.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    bg: 'bg-emerald-500/[0.04]',
    iconBg: 'border-emerald-500/25 bg-emerald-500/10',
    glow: 'hover:shadow-[0_0_24px_rgba(16,185,129,0.1)]',
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-grid">
      <Navbar />

      {/* ── Hero ── */}
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 pt-16 pb-24">
        {/* Layered radial glows */}
        <div className="hero-spotlight pointer-events-none absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] h-[500px] w-[900px] rounded-full"
          style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 75%)' }}
        />

        {/* Live badge */}
        <div className="relative z-10 mb-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.08] px-3.5 py-1.5 text-xs font-semibold text-accent backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Live stat tracking — Valorant &amp; CS2
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 mb-10 text-center space-y-2 animate-fade-in-up animation-delay-100">
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-[72px] leading-[1.05]">
            Track your stats.
          </h1>
          <h2 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-[72px] leading-[1.05]">
            <span className="gradient-text-animate">Master every game.</span>
          </h2>
          <p className="pt-3 text-[15px] text-zinc-400 max-w-md mx-auto leading-relaxed">
            Search any player across Valorant and CS2. Get KDA, win rate, match history,
            rank and more — all in one unified profile.
          </p>
        </div>

        {/* Search */}
        <div className="relative z-10 w-full animate-fade-in-up animation-delay-200">
          <SearchBar />
        </div>

        {/* Supported games */}
        <div className="relative z-10 mt-7 flex flex-wrap items-center justify-center gap-2.5 animate-fade-in-up animation-delay-300">
          <span className="text-xs text-zinc-700 mr-0.5">Supported:</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-valorant/30 bg-valorant/[0.08] px-3.5 py-1 text-xs font-bold text-valorant tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-valorant" />
            VALORANT
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cs2/30 bg-cs2/[0.08] px-3.5 py-1 text-xs font-bold text-cs2 tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-cs2" />
            CS2
          </span>
        </div>
      </main>

      {/* ── Feature cards ── */}
      <section className="relative z-10 border-t border-zinc-800/50 bg-zinc-950/60 px-4 py-16">
        {/* Top glow line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.25), transparent)' }} />

        <div className="mx-auto max-w-5xl">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-700 mb-10">
            Why GameStats
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURE_CARDS.map(({ icon: Icon, title, description, color, border, bg, iconBg, glow }, i) => (
              <div
                key={title}
                className={`relative overflow-hidden rounded-2xl border ${border} ${bg} p-6 transition-all duration-300 ${glow} animate-fade-in-up`}
                style={{ animationDelay: `${0.1 * i + 0.4}s`, opacity: 0 }}
              >
                {/* Subtle top border glow */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-50"
                  style={{ background: `linear-gradient(90deg, transparent, currentColor, transparent)` }} />

                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border ${iconBg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="mb-2 text-sm font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
