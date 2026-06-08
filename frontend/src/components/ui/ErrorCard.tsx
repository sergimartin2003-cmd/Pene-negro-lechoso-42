import { AlertTriangle, RefreshCw } from 'lucide-react';

const ERROR_MESSAGES: Record<string, { title: string; hint: string }> = {
  PLAYER_NOT_FOUND:  { title: 'Player not found',        hint: 'Double-check the name and tag. Names are case-sensitive.' },
  PRIVATE_PROFILE:   { title: 'Private profile',          hint: 'This player has set their profile to private.' },
  GAME_API_DOWN:     { title: 'Game API unavailable',     hint: 'The game API is temporarily down. Try again in a few minutes.' },
  RATE_LIMITED:      { title: 'Rate limit hit',           hint: 'Too many requests. Please wait a moment and try again.' },
  INTERNAL_ERROR:    { title: 'Something went wrong',     hint: 'An unexpected error occurred. Please try again.' },
};

export function ErrorCard({ code, message }: { code?: string; message?: string }) {
  const info: { title: string; hint: string } = (code && ERROR_MESSAGES[code]) || { title: 'Error', hint: message ?? 'An unknown error occurred.' };

  return (
    <div className="mx-auto max-w-md py-16">
      <div className="rounded-2xl border border-red-500/25 bg-red-500/[0.06] p-8 text-center">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
          <AlertTriangle className="h-7 w-7 text-red-400" />
        </div>

        {/* Text */}
        <h3 className="mb-2 text-lg font-bold text-white">{info.title}</h3>
        <p className="text-sm leading-relaxed text-zinc-500">{info.hint}</p>

        {/* Try again */}
        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-700 hover:text-white"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    </div>
  );
}
