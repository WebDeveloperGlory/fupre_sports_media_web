import { LineUp, Team } from "./stateTypes"

type Result = {
    homeScore: number | null,
    awayScore: number | null,
    homePenalty: number | null,
    awayPenalty: number | null
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