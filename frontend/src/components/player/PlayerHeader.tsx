import Image from 'next/image';
import type { NormalizedPlayerStats } from '@/types';
import { timeAgo } from '@/lib/utils';
import { Clock, Shield } from 'lucide-react';

const GAME_CONFIG: Record<string, {
  label: string;
  badge: string;
  bannerFrom: string;
  bannerVia: string;
  ring: string;
  glow: string;
  accentHex: string;
}> = {
  valorant: {
    label: 'VALORANT',
    badge: 'border-valorant/50 bg-valorant/20 text-valorant',
    bannerFrom: 'rgba(255,70,85,0.22)',
    bannerVia: 'rgba(180,20,35,0.10)',
    ring: 'ring-valorant/60',
    glow: 'glow-valorant',
    accentHex: '#ff4655',
  },
  cs2: {
    label: 'CS2',
    badge: 'border-cs2/50 bg-cs2/20 text-cs2',
    bannerFrom: 'rgba(240,165,0,0.22)',
    bannerVia: 'rgba(180,110,0,0.10)',
    ring: 'ring-cs2/60',
    glow: 'glow-cs2',
    accentHex: '#f0a500',
  },
  dota2: {
    label: 'DOTA 2',
    badge: 'border-purple-500/50 bg-purple-500/20 text-purple-400',
    bannerFrom: 'rgba(168,85,247,0.20)',
    bannerVia: 'rgba(100,40,180,0.10)',
    ring: 'ring-purple-500/60',
    glow: '',
    accentHex: '#a855f7',
  },
};

export function PlayerHeader({ player }: { player: NormalizedPlayerStats }) {
  const cfg = GAME_CONFIG[player.platform] ?? GAME_CONFIG['valorant'];
  const initial = player.displayName[0]?.toUpperCase() ?? '?';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-zinc-800/80 ${cfg.glow}`}
    >
      {/* Multi-layer gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, ${cfg.bannerFrom} 0%, ${cfg.bannerVia} 40%, transparent 70%),
            linear-gradient(to bottom, transparent 0%, rgba(9,9,11,0.6) 100%)
          `,
        }}
      />
      {/* Subtle grid overlay on banner */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(${cfg.accentHex}22 1px, transparent 1px), linear-gradient(90deg, ${cfg.accentHex}22 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      {/* Bottom fade to page bg */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950/70 to-transparent" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 px-6 py-8 sm:py-7">
        {/* Avatar */}
        <div
          className={`shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-zinc-950 ${cfg.ring}`}
          style={{ boxShadow: `0 0 24px ${cfg.accentHex}44` }}
        >
          {player.avatarUrl ? (
            <Image
              src={player.avatarUrl}
              alt={player.displayName}
              width={88}
              height={88}
              className="rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-[88px] w-[88px] items-center justify-center rounded-full text-3xl font-black text-white"
              style={{ background: `linear-gradient(135deg, ${cfg.accentHex}33, ${cfg.accentHex}11)`, border: `1px solid ${cfg.accentHex}44` }}
            >
              {initial}
            </div>
          )}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          {/* Game badge */}
          <div className="mb-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest ${cfg.badge}`}>
              <Shield className="h-2.5 w-2.5" />
              {cfg.label}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-3xl font-black text-white tracking-tight leading-none truncate mb-1.5">
            {player.displayName}
          </h1>

          {/* Level + rank */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {player.level > 0 && (
              <span className="text-sm text-zinc-400">
                Level <span className="font-bold text-zinc-200">{player.level}</span>
              </span>
            )}
            {player.rank && (
              <>
                <span className="h-1 w-1 rounded-full bg-zinc-700" />
                <span className="text-sm font-bold text-zinc-200">
                  {player.rank.tier}
                  {player.rank.division ? ` ${player.rank.division}` : ''}
                  {player.rank.lp > 0 && (
                    <span className="ml-1.5 font-normal text-zinc-500">{player.rank.lp} LP</span>
                  )}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Updated at — bottom right */}
        <div className="flex items-center gap-1.5 self-start sm:self-end text-xs text-zinc-600 shrink-0">
          <Clock className="h-3 w-3" />
          Updated {timeAgo(player.cachedAt)}
        </div>
      </div>
    </div>
  );
}
