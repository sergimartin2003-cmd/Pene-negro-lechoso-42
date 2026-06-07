import type { NormalizedMatch } from '@/types';
import { formatDuration, timeAgo, cn } from '@/lib/utils';
import { Clock, Map } from 'lucide-react';

export function MatchCard({ match }: { match: NormalizedMatch }) {
  const isWin  = match.result === 'win';
  const isLoss = match.result === 'loss';

  return (
    <div
      className={cn(
        'match-row group relative flex items-center gap-4 overflow-hidden rounded-xl border pl-0 pr-4 py-0',
        isWin
          ? 'border-green-500/20 bg-green-500/[0.04] hover:bg-green-500/[0.07]'
          : isLoss
          ? 'border-red-500/20 bg-red-500/[0.04] hover:bg-red-500/[0.07]'
          : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60'
      )}
    >
      {/* Left colored accent bar */}
      <div
        className={cn(
          'h-full w-1 self-stretch shrink-0 rounded-l-xl',
          isWin ? 'bg-green-500' : isLoss ? 'bg-red-500' : 'bg-zinc-600'
        )}
        style={{ minHeight: '64px' }}
      />

      {/* Result badge */}
      <div className="shrink-0 w-12 text-center">
        <span
          className={cn(
            'inline-block rounded-md px-2 py-0.5 text-xs font-black uppercase tracking-wider',
            isWin
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : isLoss
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-zinc-700/50 text-zinc-400 border border-zinc-600/30'
          )}
        >
          {isWin ? 'WIN' : isLoss ? 'LOSS' : 'DRAW'}
        </span>
      </div>

      {/* Map / mode + agent */}
      <div className="flex-1 min-w-0 py-4">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Map className="h-3 w-3 text-zinc-600 shrink-0" />
          <p className="text-sm font-bold text-white truncate">{match.mapOrMode}</p>
        </div>
        {match.agentOrHero && (
          <p className="text-xs text-zinc-500 truncate">{match.agentOrHero}</p>
        )}
        {match.score && (
          <p className="text-xs font-semibold text-zinc-500 mt-0.5">{match.score}</p>
        )}
      </div>

      {/* KDA */}
      <div className="shrink-0 text-center font-mono">
        <p className="text-base font-black text-white leading-tight tracking-tight">
          <span className="text-zinc-200">{match.kills}</span>
          <span className="mx-1 text-zinc-600">/</span>
          <span className="text-red-400">{match.deaths}</span>
          <span className="mx-1 text-zinc-600">/</span>
          <span className="text-zinc-200">{match.assists}</span>
        </p>
        <p className="text-[10px] uppercase tracking-widest text-zinc-600 mt-0.5">K / D / A</p>
      </div>

      {/* Duration + time */}
      <div className="shrink-0 text-right text-xs text-zinc-500 space-y-0.5">
        <div className="flex items-center justify-end gap-1">
          <Clock className="h-3 w-3 text-zinc-700" />
          <span>{formatDuration(match.durationSeconds)}</span>
        </div>
        <p className="text-zinc-600">{timeAgo(match.playedAt)}</p>
      </div>
    </div>
  );
}
