'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Entry = {
  rank: number; username: string; game: string; gameLabel: string;
  kd: number; winRate: number; gamesPlayed: number; rank_tier: string; region: string;
};

const DATA: Entry[] = [
  { rank: 1,  username: 'TenZ',       game: 'valorant', gameLabel: 'VALORANT', kd: 3.21, winRate: 67, gamesPlayed: 1240, rank_tier: 'Radiant',      region: 'NA' },
  { rank: 2,  username: 's1mple',     game: 'cs2',      gameLabel: 'CS2',      kd: 2.94, winRate: 71, gamesPlayed: 3840, rank_tier: 'Global Elite',  region: 'EU' },
  { rank: 3,  username: 'ScreaM',     game: 'valorant', gameLabel: 'VALORANT', kd: 2.87, winRate: 64, gamesPlayed: 980,  rank_tier: 'Immortal 3',    region: 'EU' },
  { rank: 4,  username: 'NiKo',       game: 'cs2',      gameLabel: 'CS2',      kd: 2.71, winRate: 68, gamesPlayed: 4200, rank_tier: 'Global Elite',  region: 'EU' },
  { rank: 5,  username: 'Yay',        game: 'valorant', gameLabel: 'VALORANT', kd: 2.65, winRate: 62, gamesPlayed: 870,  rank_tier: 'Radiant',       region: 'NA' },
  { rank: 6,  username: 'device',     game: 'cs2',      gameLabel: 'CS2',      kd: 2.58, winRate: 66, gamesPlayed: 3100, rank_tier: 'Global Elite',  region: 'EU' },
  { rank: 7,  username: 'Aspas',      game: 'valorant', gameLabel: 'VALORANT', kd: 2.52, winRate: 60, gamesPlayed: 1100, rank_tier: 'Radiant',       region: 'BR' },
  { rank: 8,  username: 'ZywOo',      game: 'cs2',      gameLabel: 'CS2',      kd: 2.49, winRate: 65, gamesPlayed: 2900, rank_tier: 'Global Elite',  region: 'EU' },
  { rank: 9,  username: 'Derke',      game: 'valorant', gameLabel: 'VALORANT', kd: 2.44, winRate: 61, gamesPlayed: 760,  rank_tier: 'Immortal 3',    region: 'EU' },
  { rank: 10, username: 'sh1ro',      game: 'cs2',      gameLabel: 'CS2',      kd: 2.41, winRate: 63, gamesPlayed: 2700, rank_tier: 'Global Elite',  region: 'EU' },
  { rank: 11, username: 'cNed',       game: 'valorant', gameLabel: 'VALORANT', kd: 2.38, winRate: 59, gamesPlayed: 890,  rank_tier: 'Radiant',       region: 'EU' },
  { rank: 12, username: 'electronic', game: 'cs2',      gameLabel: 'CS2',      kd: 2.35, winRate: 61, gamesPlayed: 3200, rank_tier: 'Global Elite',  region: 'EU' },
  { rank: 13, username: 'Alfajer',    game: 'valorant', gameLabel: 'VALORANT', kd: 2.31, winRate: 58, gamesPlayed: 720,  rank_tier: 'Radiant',       region: 'EU' },
  { rank: 14, username: 'ropz',       game: 'cs2',      gameLabel: 'CS2',      kd: 2.28, winRate: 62, gamesPlayed: 2800, rank_tier: 'Global Elite',  region: 'EU' },
  { rank: 15, username: 'Chronicle',  game: 'valorant', gameLabel: 'VALORANT', kd: 2.24, winRate: 57, gamesPlayed: 680,  rank_tier: 'Immortal 3',    region: 'EU' },
];

const GAME_BADGE: Record<string, string> = {
  valorant: 'text-red-400 bg-red-500/10 border-red-500/30',
  cs2:      'text-orange-400 bg-orange-500/10 border-orange-500/30',
};

const SORT_OPTIONS = [
  { key: 'kd',          label: 'K/D Ratio' },
  { key: 'winRate',     label: 'Win Rate' },
  { key: 'gamesPlayed', label: 'Games Played' },
] as const;

type SortKey = typeof SORT_OPTIONS[number]['key'];
type Filter = 'all' | 'valorant' | 'cs2';

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('kd');

  const filtered = DATA
    .filter(e => filter === 'all' || e.game === filter)
    .sort((a, b) => b[sortKey] - a[sortKey])
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h1 className="text-3xl font-black text-white">Leaderboard</h1>
          </div>
          <p className="text-sm text-muted">Top players ranked by performance across all games</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            {(['all', 'valorant', 'cs2'] as Filter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize transition-colors',
                  filter === f
                    ? f === 'valorant' ? 'border-red-500/60 bg-red-500/10 text-red-400'
                      : f === 'cs2' ? 'border-orange-500/60 bg-orange-500/10 text-orange-400'
                      : 'border-accent/60 bg-accent/10 text-accent'
                    : 'border-border text-muted hover:text-white hover:border-zinc-500'
                )}>
                {f === 'all' ? 'All Games' : f === 'valorant' ? 'Valorant' : 'CS2'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>Sort by:</span>
            {SORT_OPTIONS.map(o => (
              <button key={o.key} onClick={() => setSortKey(o.key)}
                className={cn(
                  'rounded px-2 py-1 transition-colors',
                  sortKey === o.key ? 'bg-accent/20 text-accent' : 'hover:text-white'
                )}>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 podium */}
        {top3.length >= 3 && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            {[top3[1], top3[0], top3[2]].map((entry, podiumIdx) => {
              const isFirst = podiumIdx === 1;
              return (
                <Link key={entry.username} href={`/player/${entry.game}/${entry.username}`}
                  className={cn(
                    'relative flex flex-col items-center rounded-xl border p-4 text-center transition-all hover:scale-105',
                    isFirst
                      ? 'border-yellow-500/40 bg-yellow-500/5 mt-0'
                      : 'border-border bg-surface mt-4'
                  )}>
                  {isFirst && (
                    <div className="absolute -top-3">
                      <Crown className="h-6 w-6 text-yellow-400" />
                    </div>
                  )}
                  <div className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-black mb-2',
                    isFirst ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                      : podiumIdx === 0 ? 'border-zinc-300 text-zinc-300 bg-zinc-300/10'
                      : 'border-amber-600 text-amber-600 bg-amber-600/10'
                  )}>
                    {entry.rank}
                  </div>
                  <p className="text-sm font-bold text-white truncate w-full">{entry.username}</p>
                  <span className={cn('mt-1 rounded border px-1.5 py-0.5 text-xs font-bold', GAME_BADGE[entry.game])}>
                    {entry.gameLabel}
                  </span>
                  <p className="mt-2 text-xl font-black text-white">{entry.kd.toFixed(2)}</p>
                  <p className="text-xs text-muted">K/D</p>
                  <p className="text-xs text-muted mt-1">{entry.rank_tier}</p>
                </Link>
              );
            })}
          </div>
        )}

        {/* Table */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="grid grid-cols-[2rem_1fr_auto_auto_auto_auto] items-center gap-4 px-4 py-2 border-b border-border text-xs font-semibold uppercase tracking-wider text-muted">
            <span>#</span>
            <span>Player</span>
            <span className="text-right">K/D</span>
            <span className="text-right hidden sm:block">Win Rate</span>
            <span className="text-right hidden md:block">Games</span>
            <span className="text-right hidden sm:block">Rank</span>
          </div>
          <div className="divide-y divide-border">
            {rest.map(entry => (
              <Link key={entry.username} href={`/player/${entry.game}/${entry.username}`}
                className="grid grid-cols-[2rem_1fr_auto_auto_auto_auto] items-center gap-4 px-4 py-3 hover:bg-surface-2 transition-colors group">
                <span className="text-xs font-mono text-muted">{entry.rank}</span>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 border border-border text-xs font-bold text-muted group-hover:text-white transition-colors">
                    {entry.username[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-accent transition-colors">{entry.username}</p>
                    <span className={cn('rounded border px-1 py-0.5 text-xs font-bold', GAME_BADGE[entry.game])}>
                      {entry.gameLabel}
                    </span>
                  </div>
                </div>
                <span className={cn('text-right font-mono text-sm font-bold', entry.kd >= 2.5 ? 'text-green-400' : entry.kd >= 1.5 ? 'text-white' : 'text-muted')}>
                  {entry.kd.toFixed(2)}
                </span>
                <span className="text-right text-sm hidden sm:block text-muted">{entry.winRate}%</span>
                <span className="text-right text-sm hidden md:block text-muted">{entry.gamesPlayed.toLocaleString()}</span>
                <span className="text-right text-xs hidden sm:block text-muted truncate max-w-[80px]">{entry.rank_tier}</span>
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          Leaderboard updates every 2 hours · Data sourced from official game APIs
        </p>
      </main>
      <Footer />
    </div>
  );
}
