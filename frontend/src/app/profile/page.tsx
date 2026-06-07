import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-white">Unified Profile</h1>
        <div className="rounded-xl border border-dashed border-border bg-surface/40 p-12 text-center">
          <p className="text-base font-medium text-white">Coming Soon</p>
          <p className="mt-1 text-sm text-muted">
            Link your Valorant and Steam accounts to a single profile.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
