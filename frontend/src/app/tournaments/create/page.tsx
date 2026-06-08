'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { createTournament } from '@/lib/api';
import { SUPPORTED_GAMES } from '@/types';
import { cn } from '@/lib/utils';

const ALL_GAMES = [
  ...SUPPORTED_GAMES,
  { id: 'fortnite', label: 'Fortnite' },
  { id: 'dota2', label: 'Dota 2' },
  { id: 'multi', label: 'Multi-Game' },
];

export default function CreateTournamentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', game_id: 'valorant',
    entry_fee: '1', max_players: '100',
    starts_at: '', rules: '',
  });

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await createTournament({
        title: form.title,
        description: form.description || undefined,
        game_id: form.game_id,
        entry_fee: parseFloat(form.entry_fee),
        max_players: parseInt(form.max_players),
        starts_at: new Date(form.starts_at).toISOString(),
        rules: form.rules || undefined,
      });
      router.push(`/tournaments/${res.data.id}`);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message ?? 'Failed to create tournament');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-white placeholder:text-muted outline-none focus:border-accent transition-colors';
  const labelClass = 'block text-xs font-medium text-muted mb-1.5';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-black text-white mb-1">Create Tournament</h1>
        <p className="text-sm text-muted mb-6">Set up your tournament. Entry fees go directly to the prize pool.</p>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-surface p-6">
          <div>
            <label className={labelClass}>Tournament name *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Friday Night Cup #5" required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Game *</label>
            <div className="flex flex-wrap gap-2">
              {ALL_GAMES.map(g => (
                <button key={g.id} type="button" onClick={() => set('game_id', g.id)}
                  className={cn('rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                    form.game_id === g.id ? 'border-accent bg-accent/20 text-accent' : 'border-border text-muted hover:border-zinc-500 hover:text-white'
                  )}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Entry fee (€) *</label>
              <input type="number" min="0" max="1000" step="0.5" value={form.entry_fee}
                onChange={e => set('entry_fee', e.target.value)} required className={inputClass} />
              <p className="mt-1 text-xs text-muted">0 = free entry</p>
            </div>
            <div>
              <label className={labelClass}>Max players *</label>
              <input type="number" min="2" max="1000" value={form.max_players}
                onChange={e => set('max_players', e.target.value)} required className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Start date & time *</label>
            <input type="datetime-local" value={form.starts_at}
              onChange={e => set('starts_at', e.target.value)} required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="What's this tournament about?" rows={3} className={cn(inputClass, 'resize-none')} />
          </div>

          <div>
            <label className={labelClass}>Rules</label>
            <textarea value={form.rules} onChange={e => set('rules', e.target.value)}
              placeholder="Tournament rules, format, prizes distribution…" rows={4} className={cn(inputClass, 'resize-none')} />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-bold py-3 transition-colors disabled:opacity-50">
            {loading ? 'Creating…' : 'Create Tournament'}
          </button>

          <p className="text-xs text-muted text-center">
            By creating a tournament you agree that entry fees are platform credits for entertainment purposes only.
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}
