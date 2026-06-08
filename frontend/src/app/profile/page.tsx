'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Gamepad2, Trophy, ExternalLink, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { getLinkedAccounts, unlinkAccount } from '@/lib/api';
import { LinkAccountModal } from '@/components/profile/LinkAccountModal';
import type { LinkedAccount } from '@/types';
import { getGameMeta } from '@/lib/utils';

const SUPPORTED_LINK_GAMES: Array<{ id: 'valorant' | 'cs2'; label: string }> = [
  { id: 'valorant', label: 'Valorant' },
  { id: 'cs2', label: 'CS2' },
];

export default function ProfilePage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [modalGame, setModalGame] = useState<'valorant' | 'cs2' | null>(null);

  const fetchAccounts = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getLinkedAccounts(token);
      setAccounts(res.data);
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  async function handleUnlink(id: string) {
    if (!token) return;
    await unlinkAccount(token, id);
    setAccounts(a => a.filter(acc => acc.id !== id));
  }

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {modalGame && token && (
        <LinkAccountModal
          gameId={modalGame}
          token={token}
          onLinked={() => { setModalGame(null); fetchAccounts(); }}
          onClose={() => setModalGame(null)}
        />
      )}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {/* Profile header */}
        <div className="mb-6 rounded-xl border border-border bg-surface p-6 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 border-2 border-accent text-2xl font-black text-accent">
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-black text-white">{user.username}</h1>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Linked accounts */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
              <Gamepad2 className="h-4 w-4 text-accent" /> Linked Accounts
            </h2>
            <div className="space-y-2">
              {SUPPORTED_LINK_GAMES.map(({ id, label }) => {
                const linked = accounts.filter(a => a.game_id === id);
                const meta = getGameMeta(id);
                return (
                  <div key={id}>
                    {linked.length === 0 ? (
                      <div className="flex items-center justify-between rounded-lg border border-dashed border-border px-3 py-2.5">
                        <span className={`text-xs font-bold rounded border px-2 py-0.5 ${meta.bg} ${meta.color}`}>{label}</span>
                        <button onClick={() => setModalGame(id)}
                          className="flex items-center gap-1 text-xs text-accent hover:underline">
                          <Plus className="h-3 w-3" /> Link account
                        </button>
                      </div>
                    ) : (
                      linked.map(acc => (
                        <div key={acc.id} className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`shrink-0 text-xs font-bold rounded border px-2 py-0.5 ${meta.bg} ${meta.color}`}>{label}</span>
                            <span className="text-sm text-white font-medium truncate">{acc.display_name}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Link href={`/player/${acc.game_id}/${encodeURIComponent(acc.display_name.split('#')[0])}?tag=${acc.display_name.split('#')[1] ?? ''}&region=${acc.region ?? 'eu'}`}
                              className="text-muted hover:text-white transition-colors">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                            <button onClick={() => handleUnlink(acc.id)} className="text-muted hover:text-red-400 transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
              <Trophy className="h-4 w-4 text-accent" /> Quick Actions
            </h2>
            <div className="space-y-2">
              <Link href="/" className="flex items-center gap-2 rounded-lg bg-surface-2 border border-border px-3 py-2.5 text-sm text-muted hover:text-white hover:border-zinc-500 transition-colors">
                <Gamepad2 className="h-4 w-4" /> Search a player
              </Link>
              <Link href="/tournaments" className="flex items-center gap-2 rounded-lg bg-surface-2 border border-border px-3 py-2.5 text-sm text-muted hover:text-white hover:border-zinc-500 transition-colors">
                <Trophy className="h-4 w-4" /> Browse tournaments
              </Link>
              <Link href="/tournaments/create" className="flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/30 px-3 py-2.5 text-sm text-accent hover:bg-accent/20 transition-colors">
                <Plus className="h-4 w-4" /> Create a tournament
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
