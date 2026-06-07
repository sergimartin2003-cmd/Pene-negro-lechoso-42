import type { CoreStats } from '@/types';
import { formatKD, formatWinRate } from '@/lib/utils';
import { Crosshair, TrendingUp, Gamepad2, Target, Zap, Swords } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatItemProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: boolean;
  positive?: boolean;
}

function StatItem({ label, value, icon: Icon, accent, positive }: StatItemProps) {
  return (
    <div className="stat-card group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
      {/* Subtle top gradient glow */}
      {(accent || positive) && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
          style={{ background: accent ? 'linear-gradient(90deg, transparent, #6366f1, transparent)' : 'linear-gradient(90deg, transparent, #22c55e, transparent)' }}
        />
      )}

      {/* Icon */}
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border ${
        accent
          ? 'border-accent/25 bg-accent/10 text-accent'
          : positive
          ? 'border-green-500/25 bg-green-500/10 text-green-400'
          : 'border-zinc-700 bg-zinc-800 text-zinc-400'
      }`}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Value */}
      <p className={`text-3xl font-black font-mono leading-none mb-1 tracking-tight ${
        accent ? 'text-accent' : positive ? 'text-green-400' : 'text-white'
      }`}>
        {value}
      </p>

      {/* Label */}
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        {label}
      </p>
    </div>
  );
}

export function StatsGrid({ stats }: { stats: CoreStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <StatItem
        label="K / D Ratio"
        value={formatKD(stats.kd)}
        icon={Crosshair}
        accent={stats.kd >= 1.5}
        positive={stats.kd >= 1.0 && stats.kd < 1.5}
      />
      <StatItem
        label="Win Rate"
        value={formatWinRate(stats.winRate)}
        icon={TrendingUp}
        positive={stats.winRate >= 50}
        accent={stats.winRate >= 60}
      />
      <StatItem
        label="Games Played"
        value={stats.gamesPlayed.toLocaleString()}
        icon={Gamepad2}
      />
      {stats.headshotPct !== undefined && (
        <StatItem
          label="HS %"
          value={`${stats.headshotPct}%`}
          icon={Target}
          accent={stats.headshotPct >= 30}
        />
      )}
      {stats.avgDamage !== undefined && (
        <StatItem
          label="Avg Damage"
          value={stats.avgDamage.toLocaleString()}
          icon={Zap}
          positive={stats.avgDamage >= 150}
        />
      )}
      {stats.avgKills !== undefined && (
        <StatItem
          label="Avg Kills"
          value={stats.avgKills.toFixed(1)}
          icon={Swords}
          positive={stats.avgKills >= 15}
        />
      )}
    </div>
  );
}
