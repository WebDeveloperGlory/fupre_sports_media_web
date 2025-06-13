import { FixtureCheerMeter, FixtureCommentary, FixtureLineup, FixtureOdds, FixturePlayerOfTheMatch, FixturePlayerRatings, FixtureResult, FixtureStat, FixtureStreamLinks, FixtureSubstitutions, FixtureTimeline, ShortPopulatedCompetition, ShortPopulatedTeam } from "./v2requestSubData.types";

export interface IV2FootballLiveFixture {
    _id: string;
    fixture: string;
    competition: ShortPopulatedCompetition;
    homeTeam: ShortPopulatedTeam;
    awayTeam: ShortPopulatedTeam;
    matchType: string;
    stadium: string;
    matchDate: Date;
    kickoffTime: Date;
    referee: string;
    status: 'pre-match' | '1st-half' | 'half-time' | '2nd-half' | 'extra-time' | 'penalties' | 'finished' | 'postponed' | 'abandoned';
    currentMinute: number;
    injuryTime: number;
    result: FixtureResult;
    statistics: {
        home: FixtureStat,
        away: FixtureStat
    };
    lineups: {
        home: FixtureLineup,
        away: FixtureLineup
    };
    substitutions: FixtureSubstitutions[];
    timeline: FixtureTimeline[];
    commentary: FixtureCommentary[];
    streamLinks: FixtureStreamLinks[];
    cheerMeter: FixtureCheerMeter;
    playerOfTheMatch: FixturePlayerOfTheMatch;
    playerRatings: FixturePlayerRatings;
    odds: FixtureOdds;
    attendance: number;
    weather: {
        condition: string,
        temperature: number
        humidity: number
    };
    createdAt: Date;
    updatedAt: Date;
}