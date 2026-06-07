import type { SearchResponse } from '@/types';

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
