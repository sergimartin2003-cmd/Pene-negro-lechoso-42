import type { SearchResponse, Tournament, TournamentParticipant } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export async function searchPlayer(params: {
  game: string;
  name: string;
  tag?: string;
  region?: string;
}): Promise<SearchResponse> {
  const query = new URLSearchParams({ game: params.game, name: params.name });
  if (params.tag) query.set('tag', params.tag);
  if (params.region) query.set('region', params.region);

  const res = await fetch(`${API_BASE}/search?${query}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw Object.assign(new Error(err.error ?? 'Request failed'), { code: err.code, status: res.status });
  }
  return res.json();
}

export async function getTournaments(params?: { status?: string; game?: string }): Promise<{ data: Tournament[] }> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.game) query.set('game', params.game);
  const res = await fetch(`${API_BASE}/tournaments?${query}`);
  if (!res.ok) throw new Error('Failed to fetch tournaments');
  return res.json();
}

export async function getTournament(id: string): Promise<{ data: Tournament & { participants: TournamentParticipant[] } }> {
  const res = await fetch(`${API_BASE}/tournaments/${id}`);
  if (!res.ok) throw new Error('Tournament not found');
  return res.json();
}

export async function joinTournament(id: string, data: { display_name: string; game_username: string }): Promise<void> {
  const res = await fetch(`${API_BASE}/tournaments/${id}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to join' }));
    throw Object.assign(new Error(err.error), { code: err.code });
  }
}

export async function createTournament(data: {
  title: string; description?: string; game_id: string;
  entry_fee: number; max_players: number; starts_at: string; rules?: string;
}): Promise<{ data: Tournament }> {
  const res = await fetch(`${API_BASE}/tournaments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create tournament');
  return res.json();
}
