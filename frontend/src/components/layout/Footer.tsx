export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/50 py-8">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-zinc-600">
          <span className="text-zinc-400 font-semibold">GameStats</span>
          {' '}— not affiliated with Riot Games, Valve, or any game publisher.
        </p>
        <p className="text-xs text-zinc-700">Built for players, by players.</p>
      </div>
    </footer>
  );
}
