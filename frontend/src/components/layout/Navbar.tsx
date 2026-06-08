'use client';
import Link from 'next/link';
import { Trophy, User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();

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
          <Link href="/tournaments" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Trophy className="h-3.5 w-3.5" /> Tournaments
          </Link>
          {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <User className="h-3.5 w-3.5" />
                <span className="text-white font-medium">{user.username}</span>
              </Link>
              <button onClick={logout} className="flex items-center gap-1 hover:text-red-400 transition-colors">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <Link href="/auth" className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 hover:border-accent hover:text-white transition-colors">
              <LogIn className="h-3.5 w-3.5" /> Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
