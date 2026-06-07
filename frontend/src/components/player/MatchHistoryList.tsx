import type { NormalizedMatch } from '@/types';
import { MatchCard } from './MatchCard';
import { History } from 'lucide-react';

export function MatchHistoryList({ matches }: { matches: NormalizedMatch[] }) {
  if (matches.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">
        <History className="mx-auto h-8 w-8 text-zinc-700 mb-3" />
        <p className="text-sm font-semibold text-zinc-500">No recent matches</p>
        <p className="mt-1 text-xs text-zinc-700">Match history unavailable for this player.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {matches.map(match => (
        <MatchCard key={match.matchId} match={match} />
      ))}
    </div>
  );
}
