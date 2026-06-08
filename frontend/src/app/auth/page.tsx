'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', confirm: '' });

  const inputClass = 'w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-white placeholder:text-muted outline-none focus:border-accent transition-colors';

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await login(loginForm.email, loginForm.password);
      router.push('/profile');
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally { setLoading(false); }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirm) {
      setError('Passwords do not match'); return;
    }
    setLoading(true); setError(null);
    try {
      await register(registerForm.username, registerForm.email, registerForm.password);
      router.push('/profile');
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 text-2xl font-black text-white">
        Game<span className="text-accent">Stats</span>
      </Link>

      <div className="w-full max-w-sm">
        {/* Tabs */}
        <div className="flex rounded-lg border border-border bg-surface p-1 mb-6">
          {(['login', 'register'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(null); }}
              className={cn('flex-1 rounded-md py-2 text-sm font-semibold transition-colors capitalize',
                tab === t ? 'bg-accent text-white' : 'text-muted hover:text-white'
              )}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">Email</label>
                <input type="email" required placeholder="you@example.com" value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Password</label>
                <input type="password" required placeholder="••••••••" value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} className={inputClass} />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-bold py-3 transition-colors disabled:opacity-50">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">Username</label>
                <input type="text" required placeholder="xXDragonSlayerXx" value={registerForm.username}
                  onChange={e => setRegisterForm(f => ({ ...f, username: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Email</label>
                <input type="email" required placeholder="you@example.com" value={registerForm.email}
                  onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Password</label>
                <input type="password" required placeholder="Min. 8 characters" value={registerForm.password}
                  onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Confirm password</label>
                <input type="password" required placeholder="••••••••" value={registerForm.confirm}
                  onChange={e => setRegisterForm(f => ({ ...f, confirm: e.target.value }))} className={inputClass} />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-bold py-3 transition-colors disabled:opacity-50">
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
