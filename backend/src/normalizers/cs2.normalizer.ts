import type { NormalizedPlayerStats } from './types';

interface SteamPlayerSummary {
  steamid: string;
  personaname: string;
  avatarfull: string;
  profilestate: number; // 1 = public
}

interface SteamCS2Stats {
  playerstats: {
    stats: Array<{ name: string; value: number }>;
    success: boolean;
  };
}

function getStat(stats: Array<{ name: string; value: number }>, name: string): number {
  return stats.find(s => s.name === name)?.value ?? 0;
}

export function normalizeCS2Stats(
  summary: SteamPlayerSummary,
  cs2Stats: SteamCS2Stats
): NormalizedPlayerStats {
  if (!summary.profilestate || summary.profilestate !== 1) {
    // Profile is private — return minimal data
    return {
      platform: 'cs2',
      displayName: summary.personaname,
      avatarUrl: summary.avatarfull,
      level: 0,
      rank: null,
      stats: { kd: 0, winRate: 0, gamesPlayed: 0 },
      recentMatches: [],
      cachedAt: new Date().toISOString(),
    };
  }

  const stats = cs2Stats.playerstats.stats;
  const kills = getStat(stats, 'total_kills');
  const deaths = getStat(stats, 'total_deaths');
  const wins = getStat(stats, 'total_wins');
  const roundsPlayed = getStat(stats, 'total_rounds_played');
  const headshotKills = getStat(stats, 'total_kills_headshot');

  const kd = deaths === 0 ? kills : Math.round((kills / deaths) * 100) / 100;
  const winRate = roundsPlayed === 0 ? 0 : Math.round((wins / roundsPlayed) * 100);
  const headshotPct = kills === 0 ? 0 : Math.round((headshotKills / kills) * 100);

  return {
    platform: 'cs2',
    displayName: summary.personaname,
    avatarUrl: summary.avatarfull,
    level: 0,
    rank: null, // CS2 rank requires third-party API or Valve API key upgrade
    stats: {
      kd,
      winRate,
      gamesPlayed: roundsPlayed,
      headshotPct,
    },
    recentMatches: [], // Steam API doesn't expose individual match history for CS2
    cachedAt: new Date().toISOString(),
  };
}
