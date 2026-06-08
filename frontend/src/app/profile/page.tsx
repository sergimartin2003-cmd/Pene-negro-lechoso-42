'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { User, Gamepad2, Trophy, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
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
              <LinkIcon className="h-4 w-4 text-accent" /> Linked Accounts
            </h2>
            <div className="space-y-2">
              {[
                { game: 'VALORANT', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
                { game: 'CS2', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
              ].map(({ game, color }) => (
                <div key={game} className="flex items-center justify-between rounded-lg border border-dashed border-border px-3 py-2.5">
                  <span className={`text-xs font-bold rounded border px-2 py-0.5 ${color}`}>{game}</span>
                  <button className="text-xs text-accent hover:underline">Link account</button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
              <Gamepad2 className="h-4 w-4 text-accent" /> Quick Actions
            </h2>
            <div className="space-y-2">
              <Link href="/" className="flex items-center gap-2 rounded-lg bg-surface-2 border border-border px-3 py-2.5 text-sm text-muted hover:text-white hover:border-zinc-500 transition-colors">
                <User className="h-4 w-4" /> Search a player
              </Link>
              <Link href="/tournaments" className="flex items-center gap-2 rounded-lg bg-surface-2 border border-border px-3 py-2.5 text-sm text-muted hover:text-white hover:border-zinc-500 transition-colors">
                <Trophy className="h-4 w-4" /> Browse tournaments
              </Link>
              <Link href="/tournaments/create" className="flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/30 px-3 py-2.5 text-sm text-accent hover:bg-accent/20 transition-colors">
                <Trophy className="h-4 w-4" /> Create a tournament
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
