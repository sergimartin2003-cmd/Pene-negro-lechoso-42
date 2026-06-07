'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { GameSelector } from './GameSelector';
import { SUPPORTED_GAMES, type GameId } from '@/types';
import { cn } from '@/lib/utils';

export function SearchBar() {
  const router = useRouter();
  const [game, setGame] = useState<GameId>('valorant');
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');

  const selectedGame = SUPPORTED_GAMES.find(g => g.id === game)!;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const params = new URLSearchParams({ name: name.trim() });
    if (selectedGame.tagRequired && tag.trim()) params.set('tag', tag.trim());
    router.push(`/player/${game}/${name.trim()}?${params}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-3">
      <GameSelector selected={game} onChange={setGame} />
      <div className="flex gap-2">
        <div className="flex flex-1 overflow-hidden rounded-lg border border-border bg-surface focus-within:border-accent transition-colors">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={selectedGame.placeholder}
            className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-muted outline-none"
          />
          {selectedGame.tagRequired && (
            <>
              <span className="flex items-center px-1 text-muted">#</span>
              <input
                type="text"
                value={tag}
                onChange={e => setTag(e.target.value)}
                placeholder={selectedGame.tagPlaceholder ?? 'TAG'}
                className="w-20 bg-transparent py-3 pr-3 text-sm text-white placeholder:text-muted outline-none"
              />
            </>
          )}
        </div>
        <button
          type="submit"
          className={cn(
            'flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-colors',
            'bg-accent hover:bg-accent-hover text-white'
          )}
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </form>
  );
}
