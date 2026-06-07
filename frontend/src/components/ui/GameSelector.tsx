'use client';
import { SUPPORTED_GAMES, type GameId } from '@/types';
import { cn } from '@/lib/utils';

const GAME_COLORS: Record<GameId, string> = {
  valorant: 'border-valorant/60 bg-valorant/10 text-valorant',
  cs2: 'border-cs2/60 bg-cs2/10 text-cs2',
  dota2: 'border-purple-500/60 bg-purple-500/10 text-purple-400',
};

export function GameSelector({ selected, onChange }: { selected: GameId; onChange: (id: GameId) => void }) {
  return (
    <div className="flex gap-2">
      {SUPPORTED_GAMES.map(game => (
        <button
          key={game.id}
          onClick={() => onChange(game.id)}
          className={cn(
            'rounded-md border px-4 py-1.5 text-sm font-medium transition-all',
            selected === game.id
              ? GAME_COLORS[game.id]
              : 'border-border text-muted hover:border-zinc-500 hover:text-white'
          )}
        >
          {game.label}
        </button>
      ))}
    </div>
  );
}
