import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKD(kd: number): string {
  return kd.toFixed(2);
}

export function formatWinRate(wr: number): string {
  return `${Math.round(wr)}%`;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(amount);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  }).format(new Date(iso));
}

export function spotsLeft(tournament: { max_players: number; current_players: number }): number {
  return tournament.max_players - tournament.current_players;
}

const GAME_META: Record<string, { label: string; color: string; bg: string }> = {
  valorant: { label: 'VALORANT', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
  cs2:      { label: 'CS2',      color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  fortnite: { label: 'FORTNITE', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  dota2:    { label: 'DOTA 2',   color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  multi:    { label: 'MULTI',    color: 'text-cyan-400',   bg: 'bg-cyan-500/10 border-cyan-500/30' },
};

export function getGameMeta(gameId: string) {
  return GAME_META[gameId] ?? { label: gameId.toUpperCase(), color: 'text-zinc-400', bg: 'bg-zinc-500/10 border-zinc-500/30' };
}
