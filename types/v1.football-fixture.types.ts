export interface FixtureProps {
    id?: string;
    competition: string | null;
    homeTeam: string | null;
    awayTeam: string | null;

    isTemporaryMatch: boolean;
    temporaryHomeTeamName: string | null;
    temporaryAwayTeamName: string | null;

    matchType: FixtureType;
    stadium: string;

    scheduledDate: Date;
    status: FixtureStatus;
    postponedReason: string | null;
    rescheduledDate: Date | null;

    result: FixtureResult;
    goalScorers: FixtureGoalScorers[];

    statistics: FixtureStatistics;

    playerStats: string[];

    lineups: FixtureLineups;

    substitutions: FixtureSubstitutions[];
    timeline: FixtureTimeline[];
    commentary: FixtureCommentary[];

    playerOfTheMatch: FixturePlayerOfTheMatch;

    referee: string;
    attendance: number;
    weather: FixtureWeather;
    highlights: FixtureStreamLinks[];
    isDerby: boolean;
    odds: FixtureOdds;

    createdAt?: Date;
    updatedAt?: Date;
}

export enum FixtureType {
    COMPETITION = 'competition',
    FRIENDLY = 'friendly',
}

export enum FixtureStatus {
    SCHEDULED = 'scheduled',
    LIVE = 'live',
    COMPLETED = 'completed',
    POSTPONED = 'postponed',
    CANCELED = 'canceled'
}

export enum FixtureTeamType {
    HOME = 'home',
    AWAY = 'away'
}

export enum FixtureTimelineType {
    GOAL = 'goal',
    YELLOWCARD = 'yellow-card',
    REDCARD = 'red-card',
    SUBSTITUTION = 'substitution',
    CORNER = 'corner',
    OFFSIDE = 'offside',
    PENALTYAWARDED = 'penalty-awarded',
    PENALTYMISSED = 'penalty-missed',
    PENALTYSAVED = 'penalty-saved',
    OWNGOAL = 'own-goal',
    VARDECISION = 'var-decision',
    INJURY = 'injury'
}

export enum FixtureTimelineGoalType {
    REGULAR = 'regular',
    PENALTY = 'penalty',
    FREEKICK = 'free-kick',
    HEADER = 'header',
    OWNGOAL = 'own-goal'
}

export enum FixtureTimelineCardType {
    FIRSTYELLOW = 'first-yellow',
    SECONDYELLOW = 'second-yellow',
    STRAIGHTRED = 'straight-red'
}

export enum FixtureCommentaryType {
    IMPORTANT = 'important',
    REGULAR = 'regular',
    HIGHLIGHT = 'highlight'
}

export enum FixtureWinner {
    HOME = 'home',
    DRAW = 'draw',
    AWAY = 'away',
}

export type FixtureStatistics = {
    home: {
        shotsOnTarget: number;
        shotsOffTarget: number;
        fouls: number;
        yellowCards: number;
        redCards: number;
        offsides: number;
        corners: number;
        possessionTime: number;
    };
    away: {
        shotsOnTarget: number;
        shotsOffTarget: number;
        fouls: number;
        yellowCards: number;
        redCards: number;
        offsides: number;
        corners: number;
        possessionTime: number;
    };
}

export type FixtureResult = {
    homeScore: number;
    awayScore: number;
    halftimeHomeScore: number | null;
    halftimeAwayScore: number | null;
    homePenalty: number | null;
    awayPenalty: number | null;
    winner?: FixtureWinner;
}

export type FixtureSubstitutions = {
    id: string;
    team: FixtureTeamType;
    playerOut: string | null;
    playerIn: string | null;
    temporaryPlayerOutName: string | null;
    temporaryPlayerInName: string | null;
    minute: number;
    injury: boolean;
}

export type FixtureTimeline = {
    id: string;
    type: FixtureTimelineType;
    team: FixtureTeamType;
    player: string | null;
    relatedPlayer: string | null;
    temporaryPlayerName: string | null;
    temporaryRelatedPlayerName: string | null;
    minute: number;
    injuryTime?: boolean;
    description: string;
    goalType: FixtureTimelineGoalType;
    cardType: FixtureTimelineCardType;
}

export type FixtureCommentary = {
    id: string;
    minute: number;
    injuryTime: boolean;
    type: FixtureCommentaryType;
    text: string;
}

export type FixtureStreamLinks = {
    platform: string;
    url: string;
    isOfficial: boolean;
    requiresSubscription: boolean;
}

export type FixtureOdds = {
    preMatch: {
        homeWin: number;
        draw: number;
        awayWin: number;
        overUnder: {
            line: number;
            over: number;
            under: number;
        }[];
    },
    live: {
        updatedAt: Date;
        homeWin: number;
        draw: number;
        awayWin: number;
        overUnder: {
            line: number;
            over: number;
            under: number;
        }[];
    } | null;
}

export type FixturePlayerOfTheMatch = {
    official: string | null;
    temporaryOfficialName: string | null;
    fanVotes: {
        player: string;
        temporaryPlayerName: string;
        votes: number;
    }[];
    userVotes: {
        userId: string;
        playerId: string;
        temporaryPlayerName: string;
        timestamp: Date;
    }[];
}

export type FixtureGoalScorers = {
    id: string;
    player: { name: string; photo: string; } | null;
    temporaryPlayerName: string | null;
    team: string | null;
    temporaryTeamName: string | null;
    time: number;
    assist: { name: string; photo: string; } | null;
    temporaryAssistName: string | null;
}

export type FixtureLineups = {
    home: {
        startingXI: string[];
        substitutes: string[];
        formation: string;
        coach: string;
    };
    away: {
        startingXI: string[];
        substitutes: string[];
        formation: string;
        coach: string;
    };
}

export type FixtureWeather = {
    condition: string;
    temperature: number;
}