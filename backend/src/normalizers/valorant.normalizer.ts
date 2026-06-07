import type { NormalizedPlayerStats, NormalizedMatch } from './types';

// Raw Riot API shape (minimal — extend as needed)
interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

interface RiotRankedEntry {
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

interface RiotMatchParticipant {
  puuid: string;
  kills: number;
  deaths: number;
  assists: number;
  headshots: number;
  bodyshots: number;
  legshots: number;
  damage: { made: number };
  characterId: string;
  score: number;
  team: string;
}

interface RiotMatch {
  metadata: { matchId: string; map: string; game_length: number; game_start: number };
  players: { all_players: RiotMatchParticipant[] };
  teams: { red: { has_won: boolean; rounds_won: number; rounds_lost: number }; blue: { has_won: boolean; rounds_won: number; rounds_lost: number } };
}

const TIER_ICONS: Record<string, string> = {
  IRON: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/3/largeicon.png',
  BRONZE: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/6/largeicon.png',
  SILVER: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/9/largeicon.png',
  GOLD: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/12/largeicon.png',
  PLATINUM: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/15/largeicon.png',
  DIAMOND: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/18/largeicon.png',
  ASCENDANT: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/21/largeicon.png',
  IMMORTAL: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/24/largeicon.png',
  RADIANT: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/27/largeicon.png',
};

export function normalizeValorantStats(
  account: RiotAccount,
  ranked: RiotRankedEntry | null,
  matches: RiotMatch[],
  puuid: string
): NormalizedPlayerStats {
  const totalGames = ranked ? ranked.wins + ranked.losses : matches.length;
  const winRate = ranked && totalGames > 0
    ? Math.round((ranked.wins / totalGames) * 100)
    : 0;

  // Aggregate stats from recent matches
  const myMatches = matches.map(m =>
    m.players.all_players.find(p => p.puuid === puuid)
  ).filter(Boolean) as RiotMatchParticipant[];

  const totalKills = myMatches.reduce((s, p) => s + p.kills, 0);
  const totalDeaths = myMatches.reduce((s, p) => s + p.deaths, 0);
  const totalHeadshots = myMatches.reduce((s, p) => s + p.headshots, 0);
  const totalShots = myMatches.reduce((s, p) => s + p.headshots + p.bodyshots + p.legshots, 0);
  const totalDamage = myMatches.reduce((s, p) => s + p.damage.made, 0);

  const kd = totalDeaths === 0 ? totalKills : Math.round((totalKills / totalDeaths) * 100) / 100;
  const headshotPct = totalShots === 0 ? 0 : Math.round((totalHeadshots / totalShots) * 100);
  const avgDamage = myMatches.length === 0 ? 0 : Math.round(totalDamage / myMatches.length);

  const normalizedMatches: NormalizedMatch[] = matches.map((m, i) => {
    const me = myMatches[i];
    const myTeam = m.players.all_players.find(p => p.puuid === puuid)?.team?.toLowerCase() as 'red' | 'blue' | undefined;
    const teamData = myTeam ? m.teams[myTeam] : null;
    const won = teamData?.has_won ?? false;
    const redRounds = m.teams.red.rounds_won;
    const blueRounds = m.teams.blue.rounds_won;

    return {
      matchId: m.metadata.matchId,
      playedAt: new Date(m.metadata.game_start * 1000).toISOString(),
      result: won ? 'win' : 'loss',
      kills: me?.kills ?? 0,
      deaths: me?.deaths ?? 0,
      assists: me?.assists ?? 0,
      durationSeconds: m.metadata.game_length,
      mapOrMode: m.metadata.map,
      agentOrHero: me?.characterId,
      score: `${myTeam === 'red' ? redRounds : blueRounds}-${myTeam === 'red' ? blueRounds : redRounds}`,
    };
  });

  return {
    platform: 'valorant',
    displayName: `${account.gameName}#${account.tagLine}`,
    avatarUrl: null,
    level: 0,
    rank: ranked ? {
      tier: ranked.tier,
      division: ranked.rank,
      lp: ranked.leaguePoints,
      iconUrl: TIER_ICONS[ranked.tier] ?? null,
    } : null,
    stats: {
      kd,
      winRate,
      gamesPlayed: totalGames,
      headshotPct,
      avgDamage,
      avgKills: myMatches.length > 0 ? Math.round((totalKills / myMatches.length) * 10) / 10 : 0,
    },
    recentMatches: normalizedMatches,
    cachedAt: new Date().toISOString(),
  };
}
