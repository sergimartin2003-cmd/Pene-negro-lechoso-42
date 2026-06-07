import { config } from '../config';
import { PlayerNotFoundError, GameApiDownError, PrivateProfileError } from '../errors/AppError';

const BASE = config.STEAM_BASE_URL;
const KEY = config.STEAM_API_KEY;
const CS2_APP_ID = 730;

async function steamFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new GameApiDownError('CS2');
  return res.json() as Promise<T>;
}

export async function resolveVanityUrl(vanityUrl: string): Promise<string> {
  const data = await steamFetch<{ response: { steamid?: string; success: number } }>(
    `${BASE}/ISteamUser/ResolveVanityURL/v1/?key=${KEY}&vanityurl=${encodeURIComponent(vanityUrl)}`
  );
  if (data.response.success !== 1 || !data.response.steamid) {
    throw new PlayerNotFoundError(vanityUrl, 'Steam');
  }
  return data.response.steamid;
}

export async function getPlayerSummary(steamId: string) {
  const data = await steamFetch<{ response: { players: Array<{ steamid: string; personaname: string; avatarfull: string; profilestate: number }> } }>(
    `${BASE}/ISteamUser/GetPlayerSummaries/v2/?key=${KEY}&steamids=${steamId}`
  );
  const player = data.response.players[0];
  if (!player) throw new PlayerNotFoundError(steamId, 'Steam');
  return player;
}

export async function getCS2Stats(steamId: string) {
  const data = await steamFetch<{ playerstats?: { stats: Array<{ name: string; value: number }>; success: boolean } }>(
    `${BASE}/ISteamUserStats/GetUserStatsForGame/v2/?key=${KEY}&steamid=${steamId}&appid=${CS2_APP_ID}`
  );
  if (!data.playerstats?.success) throw new PrivateProfileError(steamId);
  return data;
}
