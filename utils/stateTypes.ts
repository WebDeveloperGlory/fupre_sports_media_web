import { Fixture } from "./requestDataTypes"

interface Competition {
    name: string,
    _id: string
    type: string
}

export interface Team {
    name: string,
    _id: string
}

export interface Players {
    name: string,
    position: string,
    _id: string
}

export interface LineUp {
    formation: string | null,
    startingXI: Players[],
    subs: Players[]
}

export type EventTypes = {
    goal: string,
    assist: string,
    yellowCards: string,
    redCards: string,
    substitution: string,
    shotsOnTarget: string,
    shotsOffTarget: string,
    corners: string,
    offsides: string,
    fouls: string,
    kickoff: string,
    halftime: string,
    fulltime: string
}

export interface FixtureStats {
    shotsOnTarget: number,
    shotsOffTarget: number,
    fouls: number,
    yellowCards: number,
    redCards: number,
    offsides: number,
    corners: number,
    possessionTime: number
}

export interface LiveStatState {
    homeTeam: Team,
    awayTeam: Team,

    homeLineup: LineUp | null,
    awayLineup: LineUp | null,
    competition: Competition | null,

    home: FixtureStats,
    away: FixtureStats,

    homeScore: number,
    awayScore: number,
    homePenalty: number | null,
    awayPenalty: number | null
}

export type TeamForm = {
    awayTeamForm: string[],
    homeTeamForm: string[],
}

export type LastFixture = {
    awayLastFixtures: Fixture[],
    homeLastFixtures: Fixture[],
}

export type Head2Head = {
    homeWins: number,
    awayWins: number,
    draws: number,
    fixtures: Fixture[],
}