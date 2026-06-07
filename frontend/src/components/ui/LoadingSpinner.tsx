import { cn } from '@/lib/utils';

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      {/* Outer ring */}
      <div className="relative flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-zinc-800 border-t-accent" />
        <div
          className="absolute h-12 w-12 rounded-full opacity-30"
          style={{ boxShadow: '0 0 20px 4px rgba(99,102,241,0.5)' }}
        />
        <div className="absolute h-3 w-3 rounded-full bg-accent opacity-80 pulse-ring" />
      </div>
      <p className="text-xs font-medium text-zinc-600 tracking-widest uppercase animate-pulse">
        Loading stats…
      </p>
    </div>
  );
}
