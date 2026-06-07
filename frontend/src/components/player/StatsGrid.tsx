import type { CoreStats } from '@/types';
import { formatKD, formatWinRate } from '@/lib/utils';

interface StatItemProps { label: string; value: string; highlight?: boolean }

function StatItem({ label, value, highlight }: StatItemProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 text-center">
      <p className="text-xs text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold font-mono ${highlight ? 'text-accent' : 'text-white'}`}>{value}</p>
    </div>
  );
}

export function StatsGrid({ stats }: { stats: CoreStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <StatItem label="K/D" value={formatKD(stats.kd)} highlight={stats.kd >= 1.5} />
      <StatItem label="Win Rate" value={formatWinRate(stats.winRate)} highlight={stats.winRate >= 55} />
      <StatItem label="Games" value={stats.gamesPlayed.toLocaleString()} />
      {stats.headshotPct !== undefined && <StatItem label="HS%" value={`${stats.headshotPct}%`} />}
      {stats.avgDamage !== undefined && <StatItem label="Avg DMG" value={stats.avgDamage.toString()} />}
      {stats.avgKills !== undefined && <StatItem label="Avg Kills" value={stats.avgKills.toFixed(1)} />}
    </div>
  );
}
