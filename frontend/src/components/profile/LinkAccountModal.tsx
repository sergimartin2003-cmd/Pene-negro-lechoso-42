'use client';
import { useState } from 'react';
import { X, Link as LinkIcon } from 'lucide-react';
import { linkAccount } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Props {
  gameId: 'valorant' | 'cs2';
  token: string;
  onLinked: () => void;
  onClose: () => void;
}

const GAME_INFO = {
  valorant: { label: 'Valorant', color: 'text-red-400', placeholder: 'PlayerName', tagRequired: true },
  cs2: { label: 'CS2', color: 'text-orange-400', placeholder: 'SteamID64 or custom URL', tagRequired: false },
};

const REGIONS = ['eu', 'na', 'ap', 'kr', 'br', 'latam'];

export function LinkAccountModal({ gameId, token, onLinked, onClose }: Props) {
  const game = GAME_INFO[gameId];
  const [username, setUsername] = useState('');
  const [tag, setTag] = useState('');
  const [region, setRegion] = useState('eu');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const displayName = game.tagRequired ? `${username}#${tag}` : username;
    const externalId = displayName.toLowerCase().replace(/\s+/g, '');
    try {
      await linkAccount(token, {
        game_id: gameId,
        external_id: externalId,
        display_name: displayName,
        region: game.tagRequired ? region : undefined,
      });
      onLinked();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-white placeholder:text-muted outline-none focus:border-accent transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-bold text-white">Link {game.label} Account</h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5">
              {game.tagRequired ? 'Username' : 'Steam ID / Vanity URL'}
            </label>
            {game.tagRequired ? (
              <div className="flex overflow-hidden rounded-lg border border-border bg-surface-2 focus-within:border-accent transition-colors">
                <input value={username} onChange={e => setUsername(e.target.value)} required
                  placeholder={game.placeholder}
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-muted outline-none" />
                <span className="flex items-center px-2 text-muted text-sm">#</span>
                <input value={tag} onChange={e => setTag(e.target.value)} required
                  placeholder="TAG" className="w-16 bg-transparent py-2.5 pr-3 text-sm text-white placeholder:text-muted outline-none" />
              </div>
            ) : (
              <input value={username} onChange={e => setUsername(e.target.value)} required
                placeholder={game.placeholder} className={inputClass} />
            )}
          </div>

          {game.tagRequired && (
            <div>
              <label className="block text-xs text-muted mb-1.5">Region</label>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map(r => (
                  <button key={r} type="button" onClick={() => setRegion(r)}
                    className={cn(
                      'rounded-lg border px-3 py-1 text-xs font-semibold uppercase transition-colors',
                      region === r ? 'border-accent/60 bg-accent/10 text-accent' : 'border-border text-muted hover:text-white'
                    )}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-bold py-3 transition-colors disabled:opacity-50">
            {loading ? 'Linking…' : `Link ${game.label}`}
          </button>
        </form>
      </div>
    </div>
  );
}
