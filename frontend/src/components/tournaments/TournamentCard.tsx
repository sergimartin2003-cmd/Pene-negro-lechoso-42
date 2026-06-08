import Link from 'next/link';
import { Trophy, Users, Clock, Coins } from 'lucide-react';
import type { Tournament } from '@/types';
import { formatCurrency, formatDate, spotsLeft, getGameMeta } from '@/lib/utils';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-green-500/15 text-green-400 border-green-500/30',
  full: 'bg-red-500/15 text-red-400 border-red-500/30',
  in_progress: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  finished: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
  cancelled: 'bg-zinc-500/15 text-zinc-500 border-zinc-500/30',
};

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  full: 'Full',
  in_progress: 'Live',
  finished: 'Finished',
  cancelled: 'Cancelled',
};

export function TournamentCard({ t }: { t: Tournament }) {
  const game = getGameMeta(t.game_id);
  const spots = spotsLeft(t);
  const fillPct = Math.round((t.current_players / t.max_players) * 100);

  return (
    <Link href={`/tournaments/${t.id}`}>
      <div className="group rounded-xl border border-border bg-surface p-5 hover:border-zinc-500 transition-all hover:bg-surface-2 cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={cn('rounded border px-2 py-0.5 text-xs font-bold', game.bg, game.color)}>
                {game.label}
              </span>
              <span className={cn('rounded border px-2 py-0.5 text-xs font-semibold', STATUS_STYLES[t.status])}>
                {STATUS_LABELS[t.status]}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white truncate group-hover:text-accent transition-colors">
              {t.title}
            </h3>
          </div>
          {/* Prize pool */}
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 text-yellow-400">
              <Trophy className="h-3.5 w-3.5" />
              <span className="text-base font-black">{formatCurrency(t.prize_pool, t.currency)}</span>
            </div>
            <p className="text-xs text-muted">prize pool</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-muted mb-3">
          <span className="flex items-center gap-1">
            <Coins className="h-3 w-3" />
            {t.entry_fee === 0 ? 'Free' : formatCurrency(t.entry_fee, t.currency)} entry
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {t.current_players}/{t.max_players}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(t.starts_at)}
          </span>
        </div>

        {/* Fill progress bar */}
        <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              fillPct >= 90 ? 'bg-red-500' : fillPct >= 60 ? 'bg-yellow-500' : 'bg-green-500'
            )}
            style={{ width: `${fillPct}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-muted text-right">
          {t.status === 'full' ? 'No spots left' : `${spots} spot${spots === 1 ? '' : 's'} left`}
        </p>
      </div>
    </Link>
  );
}
