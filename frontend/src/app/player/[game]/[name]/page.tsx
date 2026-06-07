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
      <div className="space-y-4">
        <PlayerHeader player={player} />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <StatsGrid stats={player.stats} />
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Recent Matches</h2>
              <MatchHistoryList matches={player.recentMatches} />
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Rank</h2>
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
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Suspense fallback={<LoadingSpinner className="py-20" />}>
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
