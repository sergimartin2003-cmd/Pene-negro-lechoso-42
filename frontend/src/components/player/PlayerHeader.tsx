import Image from 'next/image';
import type { NormalizedPlayerStats } from '@/types';
import { timeAgo } from '@/lib/utils';

const GAME_BADGE: Record<string, { label: string; color: string }> = {
  valorant: { label: 'VALORANT', color: 'bg-valorant/20 text-valorant border-valorant/40' },
  cs2: { label: 'CS2', color: 'bg-cs2/20 text-cs2 border-cs2/40' },
  dota2: { label: 'DOTA 2', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
};

export function PlayerHeader({ player }: { player: NormalizedPlayerStats }) {
  const badge = GAME_BADGE[player.platform];

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
      {player.avatarUrl ? (
        <Image
          src={player.avatarUrl}
          alt={player.displayName}
          width={72}
          height={72}
          className="rounded-full border-2 border-border"
        />
      ) : (
        <div className="flex h-18 w-18 items-center justify-center rounded-full border-2 border-border bg-surface-2 text-2xl font-bold text-muted">
          {player.displayName[0]?.toUpperCase()}
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-bold text-white">{player.displayName}</h1>
          {badge && (
            <span className={`rounded border px-2 py-0.5 text-xs font-bold ${badge.color}`}>
              {badge.label}
            </span>
          )}
        </div>
        {player.level > 0 && <p className="text-sm text-muted">Level {player.level}</p>}
      </div>
      <p className="hidden text-xs text-muted sm:block">Updated {timeAgo(player.cachedAt)}</p>
    </div>
  );
}
