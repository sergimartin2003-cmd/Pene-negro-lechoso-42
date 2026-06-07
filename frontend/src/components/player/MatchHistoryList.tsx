import type { NormalizedMatch } from '@/types';
import { MatchCard } from './MatchCard';

export function MatchHistoryList({ matches }: { matches: NormalizedMatch[] }) {
  if (matches.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
        No recent matches available
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
