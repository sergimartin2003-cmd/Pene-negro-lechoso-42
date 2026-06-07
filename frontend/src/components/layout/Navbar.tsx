import Link from 'next/link';
import { Search, BarChart3, User } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/30 group-hover:bg-accent/20 group-hover:border-accent/50 transition-all duration-200">
            <BarChart3 className="h-4 w-4 text-accent" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-white">
            Game<span className="text-accent">Stats</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
          >
            <Search className="h-3.5 w-3.5" />
            Search
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
          >
            <User className="h-3.5 w-3.5" />
            My Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
