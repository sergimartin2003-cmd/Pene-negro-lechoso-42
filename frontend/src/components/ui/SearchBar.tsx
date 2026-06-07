'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';
import { SUPPORTED_GAMES, type GameId } from '@/types';
import { cn } from '@/lib/utils';

const GAME_PILL: Record<GameId, { active: string; dot: string }> = {
  valorant: {
    active: 'border-valorant bg-valorant/15 text-valorant shadow-[0_0_14px_rgba(255,70,85,0.3)]',
    dot: 'bg-valorant',
  },
  cs2: {
    active: 'border-cs2 bg-cs2/15 text-cs2 shadow-[0_0_14px_rgba(240,165,0,0.3)]',
    dot: 'bg-cs2',
  },
  dota2: {
    active: 'border-purple-500 bg-purple-500/15 text-purple-400 shadow-[0_0_14px_rgba(168,85,247,0.3)]',
    dot: 'bg-purple-500',
  },
};

const REGIONS = [
  { value: 'eu', label: 'EU' },
  { value: 'na', label: 'NA' },
  { value: 'ap', label: 'AP' },
  { value: 'kr', label: 'KR' },
];

export function SearchBar() {
  const router = useRouter();
  const [game, setGame] = useState<GameId>('valorant');
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [region, setRegion] = useState('eu');

  const selectedGame = SUPPORTED_GAMES.find(g => g.id === game)!;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const params = new URLSearchParams({ name: name.trim() });
    if (selectedGame.tagRequired && tag.trim()) params.set('tag', tag.trim());
    if (selectedGame.tagRequired) params.set('region', region);
    router.push(`/player/${game}/${encodeURIComponent(name.trim())}?${params}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-3">
      {/* Game tabs */}
      <div className="flex gap-2">
        {SUPPORTED_GAMES.map(g => {
          const pill = GAME_PILL[g.id];
          const isActive = game === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setGame(g.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-200',
                isActive
                  ? pill.active
                  : 'border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300 bg-transparent'
              )}
            >
              {isActive && (
                <span className={cn('h-1.5 w-1.5 rounded-full', pill.dot)} />
              )}
              {g.label}
            </button>
          );
        })}
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        {/* Main input group */}
        <div
          className={cn(
            'focus-ring flex flex-1 overflow-hidden rounded-xl border border-zinc-700/80 bg-zinc-900/90 transition-all duration-200'
          )}
        >
          <div className="flex flex-1 items-center">
            <Search className="ml-4 h-4 w-4 shrink-0 text-zinc-600" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={selectedGame.placeholder}
              className="flex-1 bg-transparent px-3 py-4 text-sm text-white placeholder:text-zinc-600 outline-none"
            />
          </div>
          {selectedGame.tagRequired && (
            <>
              <span className="flex items-center self-stretch bg-zinc-800/60 border-l border-zinc-700/80 px-2.5 text-zinc-500 text-sm font-bold select-none">
                #
              </span>
              <input
                type="text"
                value={tag}
                onChange={e => setTag(e.target.value)}
                placeholder={selectedGame.tagPlaceholder ?? 'TAG'}
                className="w-20 bg-transparent py-4 pr-3 pl-2.5 text-sm text-white placeholder:text-zinc-600 outline-none"
              />
            </>
          )}
        </div>

        {/* Region selector — only for Valorant */}
        {selectedGame.tagRequired && (
          <div className="relative">
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="h-full appearance-none rounded-xl border border-zinc-700/80 bg-zinc-900/90 pl-3.5 pr-9 text-sm font-medium text-zinc-300 outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(99,102,241,0.22)] transition-all cursor-pointer"
            >
              {REGIONS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          </div>
        )}

        {/* Search button */}
        <button
          type="submit"
          className="btn-accent flex items-center gap-2 rounded-xl px-6 py-4 text-sm font-bold text-white whitespace-nowrap tracking-wide"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </form>
  );
}
