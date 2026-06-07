import Image from 'next/image';
import type { RankInfo } from '@/types';

export function RankCard({ rank }: { rank: RankInfo | null }) {
  if (!rank) return (
    <div className="rounded-lg border border-border bg-surface p-4 text-center text-sm text-muted">
      Unranked
    </div>
  );

  return (
    <div className="rounded-lg border border-border bg-surface p-4 flex items-center gap-3">
      {rank.iconUrl && (
        <Image src={rank.iconUrl} alt={rank.tier} width={48} height={48} className="shrink-0" />
      )}
      <div>
        <p className="text-xs text-muted uppercase tracking-wider">Rank</p>
        <p className="text-lg font-bold text-white">{rank.tier} {rank.division}</p>
        <p className="text-sm text-muted">{rank.lp} LP</p>
      </div>
    </div>
  );
}
