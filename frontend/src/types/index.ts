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

export interface Tournament {
  id: string;
  title: string;
  description: string | null;
  game_id: string;
  entry_fee: number;
  prize_pool: number;
  currency: string;
  max_players: number;
  current_players: number;
  status: 'open' | 'full' | 'in_progress' | 'finished' | 'cancelled';
  starts_at: string;
  ends_at: string | null;
  rules: string | null;
  created_at: string;
  participants?: TournamentParticipant[];
}

export interface TournamentParticipant {
  display_name: string;
  game_username: string;
  joined_at: string;
  placement: number | null;
}

export interface LinkedAccount {
  id: string;
  game_id: string;
  display_name: string;
  external_id: string;
  region: string | null;
  is_verified: boolean;
  linked_at: string;
}

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
