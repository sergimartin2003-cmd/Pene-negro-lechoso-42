import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">
            Game<span className="text-accent">Stats</span>
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-muted">
          <Link href="/" className="hover:text-white transition-colors">Search</Link>
          <Link href="/profile" className="hover:text-white transition-colors">My Profile</Link>
        </div>
      </div>
    </nav>
  );
}
