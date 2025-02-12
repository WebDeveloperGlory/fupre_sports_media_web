import { LineUp, Team } from "./stateTypes"

type Result = {
    homeScore: number | null,
    awayScore: number | null,
    homePenalty: number | null,
    awayPenalty: number | null
}

interface Statistics {
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
    wns: number,
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
        id: string
    },
    date: Date,
    stadium: string,
    status: string,
    createdAt: Date,
    goalScorers?: GoalScorers[] | [],
    __v: string,
    statistics?: string,
    matchEvents: Event[] | [],
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
    leagueTable: LeagueTableEntry[] | [],
    __v: number,
    type: string,
    stats: CompetitionStats,
    rounds: string[] | [],
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