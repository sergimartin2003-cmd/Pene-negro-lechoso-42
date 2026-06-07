import type { NormalizedMatch } from '@/types';
import { formatDuration, timeAgo, cn } from '@/lib/utils';

export function MatchCard({ match }: { match: NormalizedMatch }) {
  return (
    <div className={cn(
      'flex items-center gap-4 rounded-lg border px-4 py-3 transition-colors hover:bg-surface-2',
      match.result === 'win' ? 'border-l-4 border-l-green-500 border-border bg-green-500/5'
        : match.result === 'loss' ? 'border-l-4 border-l-red-500 border-border bg-red-500/5'
        : 'border-border bg-surface'
    )}>
      <div className="w-10 text-center">
        <span className={cn(
          'text-xs font-bold uppercase',
          match.result === 'win' ? 'text-green-400' : match.result === 'loss' ? 'text-red-400' : 'text-muted'
        )}>
          {match.result === 'win' ? 'WIN' : match.result === 'loss' ? 'LOSS' : 'DRAW'}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{match.mapOrMode}</p>
        {match.agentOrHero && <p className="text-xs text-muted">{match.agentOrHero}</p>}
      </div>
      <div className="text-center font-mono">
        <p className="text-sm font-bold text-white">
          {match.kills} / <span className="text-red-400">{match.deaths}</span> / {match.assists}
        </p>
        {match.score && <p className="text-xs text-muted">{match.score}</p>}
      </div>
      <div className="text-right text-xs text-muted">
        <p>{formatDuration(match.durationSeconds)}</p>
        <p>{timeAgo(match.playedAt)}</p>
      </div>
    </div>
  );
}
