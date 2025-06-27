import { CoachRoles, TeamTypes } from "./v2requestData.enums";
import { FixtureCheerMeter, FixtureCommentary, FixtureLineup, FixtureOdds, FixturePlayerOfTheMatch, FixturePlayerRatings, FixtureResult, FixtureStat, FixtureStreamLinks, FixtureSubstitutions, FixtureTimeline, ShortPopulatedCompetition, ShortPopulatedTeam } from "./v2requestSubData.types";

export interface IV2FootballLiveFixture {
    _id: string;
    fixture: string;
    competition: ShortPopulatedCompetition;
    homeTeam: ShortPopulatedTeam;
    awayTeam: ShortPopulatedTeam;
    matchType: 'league' | 'knockout' | 'hybrid';
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
    playerRatings: FixturePlayerRatings[];
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

export interface IV2FootballTeam {
    _id: string;
    name: string;
    shorthand: string

    type: TeamTypes;
    academicYear: string;
    department?: { _id: string, name: string };
    faculty?: { _id: string, name: string };

    coaches: {
        name: string;
        role: CoachRoles;
    }[];
    players: string[];

    friendlyRequests: {
        requestId: string,
        team: string,
        status: 'pending' | 'accepted' | 'reqjected',
        proposedDate: Date,
        message: String,
        type: 'recieved' | 'sent',
        createdAt?: Date,
    }[];
    competitionPerformance: {
        competition: string,
        season: string,
        stats: {
            played: number,
            wins: number,
            draws: number,
            losses: number,
            goalsFor: number,
            goalsAgainst: number,
            cleanSheets: number
        },
        achievements: string[]
    }[];

    stats: {
        matchesPlayed: number;
        wins: number;
        draws: number;
        losses: number;
        goalsFor: number;
        goalsAgainst: number;
        cleanSheets: number;
    };

    logo: string;
    colors: {
        primary: string;
        secondary: string;
    }

    admin: { _id: string, name: string, email: string };

    createdAt: Date;
    updatedAt: Date;
}

export interface TeamPlayerDetails {
    _id: string;
    name: string;
    admissionYear: string;
    department: string;
    clubStatus?: 'registered' | 'on-loan' | 'transferred-out';
    loanDetails?: {
        fromClub: string,
        toTeam: string,
        startDate: Date,
        endDate: Date,
        terms: string
    };
    marketValue: number;
    preferredFoot: 'left' | 'right' | 'both';
    height: string;
    weight: string;
    verificationStatus: "pending" | "verified" | "rejected";
    role: 'player' | 'captain' | 'vice-captain';
    position: string;
    jerseyNumber: number;
    joinedAt: Date;
    seasonalStats?: {
        academicYear: string;
        team: string;
        stats: {
            appearances: number,
            goals: number,
            assists: number,
            cleanSheets: number,
            yellowCards: number,
            redCards: number,
            motmAwards: number
        }
    };
    competitionStats?: {
        competition: ShortPopulatedCompetition,
        season: string,
        team: string,
        appearances: number,
        goals: number,
        assists: number,
        yellowCards: number,
        redCards: number,
        minutesPlayed: number,
    };
}