import { SearchBar } from '@/components/ui/SearchBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-20">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Your stats.{' '}
            <span className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
              All games.
            </span>
          </h1>
          <p className="text-base text-muted max-w-md mx-auto">
            Search any player across Valorant and CS2. Unified profile, instant results.
          </p>
        </div>
        <SearchBar />
        <div className="flex gap-6 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-valorant" /> Valorant
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cs2" /> CS2
          </span>
        </div>
      </main>
      <Footer />
    </div>
  );
}
