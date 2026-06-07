import { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PlayerHeader } from '@/components/player/PlayerHeader';
import { StatsGrid } from '@/components/player/StatsGrid';
import { RankCard } from '@/components/player/RankCard';
import { MatchHistoryList } from '@/components/player/MatchHistoryList';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { searchPlayer } from '@/lib/api';

interface Props {
  params: { game: string; name: string };
  searchParams: { tag?: string; region?: string };
}

async function PlayerData({ game, name, tag, region }: { game: string; name: string; tag?: string; region?: string }) {
  try {
    const response = await searchPlayer({ game, name, tag, region });
    const player = response.data;

    return (
      <div className="space-y-5">
        <PlayerHeader player={player} />

        {/* Tab bar — visual only for now */}
        <div className="flex gap-1 border-b border-zinc-800 pb-0">
          {['Overview', 'Matches', 'Stats'].map((tab, i) => (
            <button
              key={tab}
              type="button"
              className={
                i === 0
                  ? 'relative px-4 py-2.5 text-sm font-semibold text-white after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent after:rounded-full'
                  : 'px-4 py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors'
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Left: stats + matches */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600">
                <span className="h-px flex-1 bg-zinc-800" />
                Performance
                <span className="h-px flex-1 bg-zinc-800" />
              </h2>
              <StatsGrid stats={player.stats} />
            </div>

            <div>
              <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600">
                <span className="h-px flex-1 bg-zinc-800" />
                Recent Matches
                <span className="h-px flex-1 bg-zinc-800" />
              </h2>
              <MatchHistoryList matches={player.recentMatches} />
            </div>
          </div>

          {/* Right: rank */}
          <div className="space-y-4">
            <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600">
              <span className="h-px flex-1 bg-zinc-800" />
              Rank
              <span className="h-px flex-1 bg-zinc-800" />
            </h2>
            <RankCard rank={player.rank} />
          </div>
        </div>
      </div>
    );
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    return <ErrorCard code={error.code} message={error.message} />;
  }
}

export default function PlayerPage({ params, searchParams }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-grid">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Suspense fallback={<LoadingSpinner className="py-24" />}>
          <PlayerData
            game={params.game}
            name={decodeURIComponent(params.name)}
            tag={searchParams.tag}
            region={searchParams.region}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
