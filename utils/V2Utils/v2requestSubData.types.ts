import { CompetitionType, FixtureCommentaryType, FixtureTimelineCardType, FixtureTimelineGoalType, FixtureTimelineType, TeamType } from "./v2requestData.enums";

// GENERAL TYPES //
export type ShortPopulatedPlayer = {
    _id: string;
    name: string;
    position: string;
}

export type ShortPopulatedCompetition = {
    _id: string;
    name: string;
    type: CompetitionType;
    shorthand?: string;
}

export type ShortPopulatedTeam = {
    _id: string;
    name: string;
    shorthand?: string;
    logo?: string;
}
// END OF GENERAL TYPES //

// LIVE FIXTURE TYPES //
export type FixtureResult = {
    homeScore: number,
    awayScore: number,
    halftimeHomeScore: number | null,
    halftimeAwayScore: number | null,
    homePenalty: number | null,
    awayPenalty: number | null,
    winner?: 'home' | 'away' | 'draw',
}

export type FixtureStat = {
    shotsOnTarget: number,
    shotsOffTarget: number,
    fouls: number,
    yellowCards: number,
    redCards: number,
    offsides: number,
    corners: number,
    possessionTime: number,
}

export type FixtureLineup = {
    startingXI: StartingXI[],
    substitutes: Substitute[],
    formation: string,
    coach: string,
}

export type FixtureSubstitutions = {
    id: string,
    team: TeamType,
    playerOut: ShortPopulatedPlayer,
    playerIn: ShortPopulatedPlayer,
    minute: number,
    injury: boolean
}

export type FixtureTimeline = {
    id: string,
    type: FixtureTimelineType,
    team: TeamType,
    player: ShortPopulatedPlayer,
    relatedPlayer: ShortPopulatedPlayer | null,
    minute: number,
    injuryTime: boolean,
    description: string,
    goalType: 'regular' | 'penalty' | 'free-kick' | 'header' | 'own-goal' | null,
    cardType: 'first-yellow' | 'second-yellow' | 'straight-red' | null,
}

export type FixtureCommentary = {
    id: string,
    minute: number,
    injuryTime: boolean,
    type: 'important' | 'regular' | 'highlight',
    text: string,
    eventId: string
}

export type FixtureStreamLinks = {
    platform: string,
    url: string,
    isOfficial: boolean,
    requiresSubscription: boolean
}

export type FixtureCheerMeter = {
    official: {
        home: number,
        away: number
    },
    unofficial: {
        home: number,
        away: number
    },
    userVotes: UserCheerVote[]
}

export type FixturePlayerOfTheMatch = {
    official: ShortPopulatedPlayer,
    fanVotes: FanPOTMVote[],
    userVotes: UserPOTMVote[]
}

export type FixturePlayerRatings = {
    player: ShortPopulatedPlayer,
    team: TeamType,
    official: {
        rating: number,
        ratedBy: string,
    },
    fanRatings: {
        average: number,
        count: number,
        distribution: { 
            '1': number, '2': number, '3': number,
            '4': number, '5': number, '6': number,
            '7': number, '8': number, '9': number,
            '10': number
        },
    },
    stats: {
        goals: number,
        assists: number,
        shots: number,
        passes: number,
        tackles: number,
        saves: number
    }
}

export type FixtureOdds = {
    preMatch: PreMatchOdds,
    live: LiveOdds
}

type StartingXI = {
    player: ShortPopulatedPlayer,
    position: string,
    shirtNumber: number,
    isCaptain: boolean,
}

type Substitute = {
    player: ShortPopulatedPlayer,
    position: string,
    shirtNumber: number,
    isCaptain?: boolean,
}

type PreMatchOdds = {
    homeWin: Number,
    draw: Number,
    awayWin: Number,
    overUnder: OverUnder[]
}

type LiveOdds = {
    updatedAt: Date,
    homeWin: number,
    draw: number,
    awayWin: number,
    overUnder: OverUnder[]
}

type OverUnder = {
    line: number,
    over: number,
    under: number
}

type UserCheerVote = {
    userId: string,
    team: TeamType,
    isOfficial: boolean,
    timestamp: Date
}

type UserPOTMVote = {
    userId: string,
    playerId: ShortPopulatedPlayer,
    timestamp: Date
}

type FanPOTMVote = {
    player: ShortPopulatedPlayer,
    votes: number,
}
// END OF LIVEFIXTURE TYPES //