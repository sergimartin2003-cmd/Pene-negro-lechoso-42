import Link from 'next/link';
import { Plus, Trophy } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TournamentCard } from '@/components/tournaments/TournamentCard';
import type { Tournament } from '@/types';

async function fetchTournaments(): Promise<Tournament[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'}/tournaments`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function TournamentsPage() {
  const tournaments = await fetchTournaments();
  const open = tournaments.filter(t => t.status === 'open');
  const others = tournaments.filter(t => t.status !== 'open');

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <h1 className="text-2xl font-black text-white">Tournaments</h1>
            </div>
            <p className="text-sm text-muted">
              Compete, win prizes. Entry fees build the prize pool.
            </p>
          </div>
          <Link
            href="/tournaments/create"
            className="flex items-center gap-2 rounded-lg bg-accent hover:bg-accent-hover px-4 py-2 text-sm font-semibold text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Tournament
          </Link>
        </div>

        {/* Legal disclaimer */}
        <div className="mb-6 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-xs text-yellow-400/80">
          Tournament entry fees are platform credits for entertainment purposes. Prize distribution is managed by the tournament creator.
        </div>

        {/* Open tournaments */}
        {open.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
              Open · {open.length} available
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {open.map(t => <TournamentCard key={t.id} t={t} />)}
            </div>
          </section>
        )}

        {/* Other tournaments */}
        {others.length > 0 && (
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
              Other
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {others.map(t => <TournamentCard key={t.id} t={t} />)}
            </div>
          </section>
        )}

        {tournaments.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-surface/40 p-16 text-center">
            <Trophy className="mx-auto h-10 w-10 text-muted mb-3" />
            <p className="font-semibold text-white">No tournaments yet</p>
            <p className="text-sm text-muted mt-1">Be the first to create one.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
