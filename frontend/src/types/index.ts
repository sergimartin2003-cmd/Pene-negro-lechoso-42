export type GameId = 'valorant' | 'cs2' | 'dota2';
export type MatchResult = 'win' | 'loss' | 'draw';

export interface RankInfo {
  tier: string;
  division: string;
  lp: number;
  iconUrl?: string;
}

export interface CoreStats {
  kd: number;
  winRate: number;
  gamesPlayed: number;
  headshotPct?: number;
  avgDamage?: number;
  avgKills?: number;
}

export interface NormalizedMatch {
  matchId: string;
  playedAt: string;
  result: MatchResult;
  kills: number;
  deaths: number;
  assists: number;
  durationSeconds: number;
  mapOrMode: string;
  agentOrHero?: string;
  score?: string;
}

export interface NormalizedPlayerStats {
  platform: GameId;
  displayName: string;
  avatarUrl: string | null;
  level: number;
  rank: RankInfo | null;
  stats: CoreStats;
  recentMatches: NormalizedMatch[];
  cachedAt: string;
}

export interface SearchResponse {
  data: NormalizedPlayerStats;
  source: 'cache' | 'live';
}

export type GameConfig = {
  id: GameId;
  label: string;
  color: string;
  placeholder: string;
  tagRequired: boolean;
  tagPlaceholder?: string;
};

export const SUPPORTED_GAMES: GameConfig[] = [
  {
    id: 'valorant',
    label: 'Valorant',
    color: '#ff4655',
    placeholder: 'PlayerName',
    tagRequired: true,
    tagPlaceholder: 'EU1',
  },
  {
    id: 'cs2',
    label: 'CS2',
    color: '#f0a500',
    placeholder: 'SteamID64 or custom URL',
    tagRequired: false,
  },
];
