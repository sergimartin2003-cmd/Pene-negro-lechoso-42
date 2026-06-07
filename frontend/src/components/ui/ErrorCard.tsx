const ERROR_MESSAGES: Record<string, { title: string; hint: string }> = {
  PLAYER_NOT_FOUND: { title: 'Player not found', hint: 'Double-check the name and tag. Names are case-sensitive.' },
  PRIVATE_PROFILE: { title: 'Private profile', hint: 'This player has set their profile to private.' },
  GAME_API_DOWN: { title: 'Game API unavailable', hint: 'The game API is temporarily down. Try again in a few minutes.' },
  RATE_LIMITED: { title: 'Rate limit hit', hint: 'Too many requests. Please wait a moment and try again.' },
  INTERNAL_ERROR: { title: 'Something went wrong', hint: 'An unexpected error occurred. Please try again.' },
};

export function ErrorCard({ code, message }: { code?: string; message?: string }) {
  const info = (code && ERROR_MESSAGES[code]) ?? { title: 'Error', hint: message ?? 'An error occurred.' };
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6 text-center">
      <p className="text-base font-semibold text-red-400">{info.title}</p>
      <p className="mt-1 text-sm text-muted">{info.hint}</p>
    </div>
  );
}
