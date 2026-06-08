'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Trophy, Users, Clock, Coins, Shield, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { getTournament, joinTournament } from '@/lib/api';
import { formatCurrency, formatDate, getGameMeta, cn } from '@/lib/utils';
import type { Tournament, TournamentParticipant } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  open: 'text-green-400 bg-green-500/10 border-green-500/30',
  full: 'text-red-400 bg-red-500/10 border-red-500/30',
  in_progress: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  finished: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30',
  cancelled: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/30',
};

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<(Tournament & { participants: TournamentParticipant[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [gameUsername, setGameUsername] = useState('');

  useEffect(() => {
    getTournament(id)
      .then(r => setTournament(r.data))
      .catch(() => setError('Tournament not found'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setJoining(true);
    setJoinError(null);
    try {
      await joinTournament(id, { display_name: displayName, game_username: gameUsername });
      setJoinSuccess(true);
      setShowJoinForm(false);
      const updated = await getTournament(id);
      setTournament(updated.data);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setJoinError(e.message ?? 'Failed to join');
    } finally {
      setJoining(false);
    }
  }

  if (loading) return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <LoadingSpinner className="flex-1" />
    </div>
  );

  if (error || !tournament) return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <ErrorCard message={error ?? 'Not found'} />
      </main>
    </div>
  );

  const game = getGameMeta(tournament.game_id);
  const fillPct = Math.round((tournament.current_players / tournament.max_players) * 100);
  const canJoin = tournament.status === 'open' && tournament.current_players < tournament.max_players;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {/* Banner */}
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="absolute inset-0 opacity-10"
            style={{ background: `radial-gradient(ellipse at 70% 50%, ${tournament.game_id === 'valorant' ? '#ff4655' : tournament.game_id === 'cs2' ? '#f0a500' : '#6366f1'} 0%, transparent 70%)` }} />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={cn('rounded border px-2 py-0.5 text-xs font-bold', game.bg, game.color)}>{game.label}</span>
                  <span className={cn('rounded border px-2 py-0.5 text-xs font-semibold', STATUS_STYLES[tournament.status])}>
                    {tournament.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <h1 className="text-2xl font-black text-white mb-1">{tournament.title}</h1>
                {tournament.description && <p className="text-sm text-muted">{tournament.description}</p>}
              </div>
              {/* Prize */}
              <div className="flex flex-col items-center rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-6 py-4 text-center shrink-0">
                <Trophy className="h-6 w-6 text-yellow-400 mb-1" />
                <p className="text-2xl font-black text-yellow-400">{formatCurrency(tournament.prize_pool, tournament.currency)}</p>
                <p className="text-xs text-muted">Prize Pool</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Coins, label: 'Entry Fee', value: tournament.entry_fee === 0 ? 'Free' : formatCurrency(tournament.entry_fee, tournament.currency) },
                { icon: Users, label: 'Players', value: `${tournament.current_players} / ${tournament.max_players}` },
                { icon: Clock, label: 'Starts', value: formatDate(tournament.starts_at) },
                { icon: Shield, label: 'Spots Left', value: tournament.max_players - tournament.current_players },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-lg bg-surface-2 border border-border px-3 py-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="h-3.5 w-3.5 text-muted" />
                    <span className="text-xs text-muted">{label}</span>
                  </div>
                  <p className="text-sm font-bold text-white">{value}</p>
                </div>
              ))}
            </div>

            {/* Fill bar */}
            <div className="mt-4 h-2 rounded-full bg-surface-2 overflow-hidden">
              <div
                className={cn('h-full rounded-full', fillPct >= 90 ? 'bg-red-500' : fillPct >= 60 ? 'bg-yellow-500' : 'bg-green-500')}
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Participants */}
          <div className="lg:col-span-2">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
              <Users className="h-4 w-4" /> Participants ({tournament.current_players})
            </h2>
            <div className="rounded-xl border border-border bg-surface divide-y divide-border overflow-hidden">
              {tournament.participants.length === 0 && (
                <div className="p-8 text-center text-sm text-muted">No participants yet. Be the first!</div>
              )}
              {tournament.participants.map((p, i) => (
                <div key={p.display_name} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition-colors">
                  <span className="w-6 text-xs text-muted font-mono text-right">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{p.display_name}</p>
                    <p className="text-xs text-muted">{p.game_username}</p>
                  </div>
                  <span className="text-xs text-muted">{formatDate(p.joined_at)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Join panel */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Join</h2>
            {joinSuccess && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center text-sm text-green-400 font-semibold mb-3">
                You joined successfully!
              </div>
            )}
            {!joinSuccess && (
              <div className="rounded-xl border border-border bg-surface p-5">
                {!canJoin ? (
                  <p className="text-sm text-muted text-center py-4">
                    {tournament.status === 'full' ? 'This tournament is full.' : 'Registration is closed.'}
                  </p>
                ) : !showJoinForm ? (
                  <div className="text-center">
                    <p className="text-sm text-muted mb-1">Entry fee</p>
                    <p className="text-3xl font-black text-white mb-4">
                      {tournament.entry_fee === 0 ? 'FREE' : formatCurrency(tournament.entry_fee, tournament.currency)}
                    </p>
                    <button
                      onClick={() => setShowJoinForm(true)}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-semibold py-3 transition-colors"
                    >
                      Join Tournament <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleJoin} className="space-y-3">
                    <div>
                      <label className="text-xs text-muted block mb-1">Your display name</label>
                      <input
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        placeholder="e.g. xXDragonSlayerXx"
                        required
                        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-white placeholder:text-muted outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted block mb-1">In-game username</label>
                      <input
                        value={gameUsername}
                        onChange={e => setGameUsername(e.target.value)}
                        placeholder="Your game ID"
                        required
                        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-white placeholder:text-muted outline-none focus:border-accent"
                      />
                    </div>
                    {joinError && <p className="text-xs text-red-400">{joinError}</p>}
                    <button
                      type="submit"
                      disabled={joining}
                      className="w-full rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-semibold py-3 transition-colors disabled:opacity-50"
                    >
                      {joining ? 'Joining…' : `Confirm & Pay ${tournament.entry_fee === 0 ? 'Free' : formatCurrency(tournament.entry_fee, tournament.currency)}`}
                    </button>
                    <p className="text-xs text-muted text-center">For entertainment purposes only.</p>
                  </form>
                )}
              </div>
            )}

            {/* Rules */}
            {tournament.rules && (
              <div className="mt-4 rounded-xl border border-border bg-surface p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Rules</h3>
                <p className="text-sm text-zinc-300 whitespace-pre-line">{tournament.rules}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
