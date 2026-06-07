import Image from 'next/image';
import type { RankInfo } from '@/types';
import { Trophy } from 'lucide-react';

export function RankCard({ rank }: { rank: RankInfo | null }) {
  if (!rank) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
          <Trophy className="h-5 w-5 text-zinc-600" />
        </div>
        <p className="text-sm font-semibold text-zinc-500">Unranked</p>
        <p className="mt-1 text-xs text-zinc-700">No ranked data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col items-center gap-3 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Current Rank</p>

      {rank.iconUrl ? (
        <Image src={rank.iconUrl} alt={rank.tier} width={72} height={72} className="shrink-0 drop-shadow-lg" />
      ) : (
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-accent/30 bg-accent/10">
          <Trophy className="h-8 w-8 text-accent" />
        </div>
      )}

      <div>
        <p className="text-2xl font-black text-white tracking-tight">
          {rank.tier}
          {rank.division ? ` ${rank.division}` : ''}
        </p>
        {rank.lp > 0 && (
          <p className="mt-1 text-sm font-semibold text-zinc-400">
            <span className="text-accent font-bold">{rank.lp}</span> LP
          </p>
        )}
      </div>
    </div>
  );
}
