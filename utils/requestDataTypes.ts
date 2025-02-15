import { LineUp, Team } from "./stateTypes"

type Result = {
    homeScore: number | null,
    awayScore: number | null,
    homePenalty: number | null,
    awayPenalty: number | null
}

export interface Statistics {
    shotsOnTarget: number;
    shotsOffTarget: number;
    fouls: number;
    yellowCards: number;
    redCards: number;
    offsides: number;
    corners: number;
}

type GoalScorers = {
    id: string,
    time: number,
    _id: string
}

type Player = {
    name: string,
    position: string,
    _id: string
}

type Event = {
    time: number,
    eventType: string,
    player: Player | null,
    team: Team | null,
    substitutedFor: Player | null,
    commentary: string | null,
    id: number
}

type LeagueTableEntry = {
    team: Team,
    played: number,
    points: number,
    position: number,
    goalDifference: number,
}

export type ExtendedLeagueTableEntry = {
    team: Team,
    played: number,
    wins: number,
    draws: number,
    losses: number,
    goalsFor: number,
    goalsAgainst: number,
    goalDifference: number,
    points: number,
    _id: string,
    form: string[] | [],
}

type CompetitionTeam = {
    squadList: Player[] | [],
    team: string | Team,
    _id: string
}

type KnockoutRounds = {
    name: string,
    fixtures: Fixture[] | string[],
    _id: string
    teams: CompetitionTeam[] | string[],
}

type CompetitionStats = {
    awayWinsPercentage: number,
    drawsPercentage: number,
    homeWinsPercentage: number,
    redCardsAvg: number,
    totalGoals: number,
    yellowCardsAvg: number,
    numberOfTeams?: number,
    teamList?: {
        name: string,
        _id: string,
        shorthand: string,
    }[],
}

type CompetitionFeaturedMatches = {
    homeTeam: {
        name: string,
        shorthand: string,
        department: string,
    },
    awayTeam: {
        name: string,
        shorthand: string,
        department: string,
    },
    _id: string,
    date: Date,
}

type TopPlayerStats = {
    player: Player,
    goals?: number,
    assists?: number,
    team: string,
    appearances: number,
}

type UpcomingFixtures = {
    awayTeam: Team & { shorthand: string, level: string, department: string },
    homeTeam: Team & { shorthand: string, level: string, department: string },
    date: Date,
    stadium: string,
    status: string,
    _id: string,
    result?: Result,
}

type CompletedFixtures = {
    awayTeam: Team & { shorthand: string, level: string, department: string },
    homeTeam: Team & { shorthand: string, level: string, department: string },
    date: Date,
    result: Result,
    status: string,
    _id: string,
    stadium?: string,
}

export interface ExtendedTeam {
    _id: string;
    name: string;
    department: string;
    shorthand: string;
    level: string;
    coach: string;
    assistantCoach: string;
    captain: Player;
    players: Player[];
}

export interface Fixture {
    result: Result,
    homeLineup: LineUp,
    awayLineup: LineUp,
    _id: string,
    homeTeam: Team,
    awayTeam: Team,
    type: string,
    competition?: {
        name: string,
        _id: string
    },
    date: Date,
    stadium: string,
    status: string,
    createdAt?: Date,
    goalScorers?: GoalScorers[] | [],
    __v?: string,
    statistics?: {
        home: Statistics,
        away: Statistics,
        createdAt: Date,
        fixture: string,
        _id: string,
        __v: number
    },
    matchEvents: Event[] | [],
    referee?: string,
    round?: string
}

export interface FixtureTeamPlayers {
    homeTeam: {
        name: string,
        players: Player[] | [],
        _id: string
    },
    awayTeam: {
        name: string,
        players: Player[] | [],
        _id: string
    },
}

export interface Competition {
    name: string,
    _id: string,
    fixtures: Fixture[] | string[],
    teams: CompetitionTeam[] | string[],
    createdAt: Date,
    description: string,
    endDate: Date,
    startDate: Date,
    status: string,
    groupStage: [],
    knockoutRounds: KnockoutRounds[] | [],
    leagueTable: ExtendedLeagueTableEntry[] | [],
    __v: number,
    type: string,
    stats: CompetitionStats,
    rounds: string[] | [],
}

export interface CompetitionOverview {
    featuredMatches: CompetitionFeaturedMatches[] | [],
    leagueFacts: CompetitionStats,
    table: LeagueTableEntry[] | [],
    topScorers: TopPlayerStats[] | [],
    topAssists: TopPlayerStats[] | [],
}

export interface CompetitionFixtures {
    completedMatches: CompletedFixtures[] | [],
    upcomingMatches: UpcomingFixtures[] | [],
}

export interface LiveFixture {
    _id: string,
    time: number,
    fixtureId: string,
    homeTeam: Team,
    awayTeam: Team,
    type: 'friendly' | 'competition',
    competition: Competition | null,
    round: string,
    referee: string,
    date: Date,
    stadium: string,
    status: 'live',
    result: Result,
    statistics: {
        home: Statistics,
        away: Statistics,
    },
    homeLineup: LineUp,
    awayLineup: LineUp,
    matchEvents: Event[],
    createdAt: Date;
}

export interface LiveMatchUpdateRequestBody {
    result?: Result, 
    statistics?: Statistics, 
    matchEvents?: Event[] | [], 
    homeLineup?: LineUp, 
    awayLineup?: LineUp
}

export interface UserProfile {
    name: string,
    email: string,
    status: string,
    role: string,
    competitions: {
        _id: string, 
        name: string, 
        description: string, 
        status: string,
        fixtures: number,
        teams: number
    }[] | null,
    team: ExtendedTeam | null,
    nextFixtures: Fixture[] | [],
}

type SummaryData = {
    title: string,
    data: {
        matches: number,
        goalsScored: number,
        goalsConceded: number
    }
}

type AttackingData = {
    title: string,
    data: {
        goalsPerGame: number,
        offsidesPerGame: number,
        cornersPerGame: number
    }
}

type DefendingData = {
    title: string,
    data: {
        yellowCardsPerGame: number,
        redCardsPerGame: number,
        goalsConcededPerGame: number,
        foulsPerGame: number,
        cleanSheets: number
    }
}

export interface TeamStatData {
    attack: AttackingData, 
    defense: DefendingData, 
    summary: SummaryData
}

type TeamPlayerStats = {
    name: string;
    position: string;
    totalGoals: number;
    totalAssists: number;
    totalYellowCards: number;
    totalRedCards: number;
};
  
type TeamCompetition = {
    competition: {
      _id: string;
      name: string;
    };
    status: string;
    _id: string;
};
  
type TopStats = {
    topScorers: TeamPlayerStats[];
    topAssisters: TeamPlayerStats[];
    topYellowCards: TeamPlayerStats[];
    topRedCards: TeamPlayerStats[];
};
  
export interface TeamOverviewData {
    info: {
        playerCount: number;
        department: string;
        level: string;
    };
    competitions: TeamCompetition[];
    recentPerformance: string[];
    nextFixture: Fixture | null;
    topStats: TopStats;
};

type PlayerCategory = {
    name: string;
    players: Player[];
};
  
export interface TeamPlayersData {
    players: PlayerCategory[];
};

export interface TeamFixtureType {
    title: string;
    fixtures: Fixture[];
};