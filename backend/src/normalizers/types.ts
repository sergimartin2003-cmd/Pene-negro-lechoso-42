export type GameId = 'valorant' | 'cs2' | 'dota2';
export type MatchResult = 'win' | 'loss' | 'draw';

export interface RankInfo {
  tier: string;       // e.g. "GOLD", "PLATINUM"
  division: string;   // e.g. "II"
  lp: number;
  iconUrl?: string;
}

export interface CoreStats {
  kd: number;
  winRate: number;       // 0-100
  gamesPlayed: number;
  headshotPct?: number;
  avgDamage?: number;
  avgKills?: number;
}

export interface NormalizedMatch {
  matchId: string;
  playedAt: string;      // ISO 8601
  result: MatchResult;
  kills: number;
  deaths: number;
  assists: number;
  durationSeconds: number;
  mapOrMode: string;
  agentOrHero?: string;
  score?: string;        // e.g. "13-7"
}

export interface NormalizedPlayerStats {
  platform: GameId;
  displayName: string;
  avatarUrl: string | null;
  level: number;
  rank: RankInfo | null;
  stats: CoreStats;
  recentMatches: NormalizedMatch[];
  cachedAt: string;      // ISO 8601 — shown as "updated X ago" in UI
}
