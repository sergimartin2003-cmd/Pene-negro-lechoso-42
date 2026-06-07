import { config } from '../config';
import { PlayerNotFoundError, GameApiDownError, RateLimitError } from '../errors/AppError';

const BASE = config.RIOT_BASE_URL;
const ACCOUNT_BASE = 'https://europe.api.riotgames.com';

async function riotFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { 'X-Riot-Token': config.RIOT_API_KEY },
    signal: AbortSignal.timeout(8000),
  });

  if (res.status === 404) throw new PlayerNotFoundError(url, 'Valorant');
  if (res.status === 429) throw new RateLimitError();
  if (!res.ok) throw new GameApiDownError('Valorant');

  return res.json() as Promise<T>;
}

export async function getAccountByRiotId(name: string, tag: string) {
  return riotFetch<{ puuid: string; gameName: string; tagLine: string }>(
    `${ACCOUNT_BASE}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`
  );
}

export async function getRankedByPuuid(region: string, puuid: string) {
  try {
    const data = await riotFetch<{ entries: Array<{ tier: string; rank: string; leaguePoints: number; wins: number; losses: number }> }>(
      `https://${region}.api.riotgames.com/val/ranked/v1/players/by-puuid/${puuid}`
    );
    return data.entries?.[0] ?? null;
  } catch {
    return null; // unranked is fine
  }
}

export async function getMatchHistoryByPuuid(region: string, puuid: string, count = 10) {
  const cluster = regionToCluster(region);
  const matchlist = await riotFetch<{ history: Array<{ matchId: string }> }>(
    `https://${cluster}.api.riotgames.com/val/match/v1/matchlists/by-puuid/${puuid}`
  );

  const matchIds = matchlist.history.slice(0, count).map(m => m.matchId);

  const matches = await Promise.allSettled(
    matchIds.map(id =>
      riotFetch(`https://${cluster}.api.riotgames.com/val/match/v1/matches/${id}`)
    )
  );

  return matches
    .filter((r): r is PromiseFulfilledResult<unknown> => r.status === 'fulfilled')
    .map(r => r.value);
}

function regionToCluster(region: string): string {
  const map: Record<string, string> = {
    eu: 'eu', na: 'na', ap: 'ap', kr: 'ap', br: 'na', latam: 'na',
  };
  return map[region.toLowerCase()] ?? 'eu';
}
