import { FixtureCommentary, FixtureGoalScorers, FixtureLineups, FixtureOdds, FixturePlayerOfTheMatch, FixtureResult, FixtureStatistics, FixtureStreamLinks, FixtureSubstitutions, FixtureTimeline, FixtureType, FixtureWeather } from "./v1.football-fixture.types";

export interface LiveFixtureProps {
    id?: string;
    fixture: string;
    competition: string | null;
    homeTeam: string | null;
    awayTeam: string | null;

    isTemporaryMatch: boolean;
    temporaryHomeTeamName: string | null;
    temporaryAwayTeamName: string | null;

    matchType: FixtureType;
    stadium: string;
    matchDate: Date;
    kickoffTime: Date;
    referee: string;

    status: LiveStatus;
    currentMinute: number;
    injuryTime: number;

    result: FixtureResult;
    goalScorers: FixtureGoalScorers[];
    statistics: FixtureStatistics;
    playerStats: string[];
    lineups: FixtureLineups;
    substitutions: FixtureSubstitutions[];
    timeline: FixtureTimeline[];
    commentary: FixtureCommentary[];
    streamLinks: FixtureStreamLinks[];
    cheerMeter: LiveFixtureCheerMeter;
    playerOfTheMatch: FixturePlayerOfTheMatch;
    odds: FixtureOdds;
    attendance: number;
    weather: FixtureWeather;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum LiveStatus {
    PREMATCH = 'pre-match',
    FIRSTHALF = '1st-half',
    HALFTIME = 'half-time',
    SECONDHALF = '2nd-half',
    EXTRATIME = 'extra-time',
    PENALTIES = 'penalties',
    FINISHED = 'finished',
    POSTPONED = 'postponed',
    ABANDONED = 'abandoned'
}

export type LiveFixtureCheerMeter = {
    home: number;
    away: number;
}