export interface ScoreData {
  home: number;
  away: number;
  updatedAt?: string;
}

export interface StatisticItem {
  type: string;
  home: number;
  away: number;
}

export interface StatisticsData {
  stats: StatisticItem[];
  updatedAt?: string;
}

export interface TimelineEvent {
  id: string;
  type: string;
  minute: number;
  player?: string;
  team?: 'home' | 'away';
  description?: string;
}

export interface LineupData {
  home: {
    coach: string;
    starting: PlayerLineup[];
    bench: PlayerLineup[];
  };
  away: {
    coach: string;
    starting: PlayerLineup[];
    bench: PlayerLineup[];
  };
}

export interface PlayerLineup {
  id: string;
  name: string;
  position: string;
  number: number;
}

export interface MinuteUpdateData {
  currentMinute: number;
  injuryTime?: number;
  status: string;
  timestamp: string;
}

export interface GoalRemovedData {
  goalScorerId: string;
  timelineIndex: number;
}

export interface PlayerRatingAddedData {
  playerId: string;
  newAverage: number;
  newCount: number;
}

export interface PlayerRatingsUpdatedData {
  ratings: {
    playerId: string;
    rating: number;
  }[];
}

export interface GeneralUpdateData {
  weather?: string;
  attendance?: number;
  referee?: string;
  kickoffTime?: string;
  updatedAt: string;
}

export interface StreamUpdateData {
  streams: {
    title: string;
    url: string;
    type: string;
  }[];
  updatedAt: string;
}

export interface CheerMeterData {
  home: number;
  away: number;
  updatedAt?: string;
}

export interface PlayerOfTheMatchData {
  playerId: string;
  name: string;
  rating: number;
}