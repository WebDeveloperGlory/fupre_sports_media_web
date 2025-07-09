import { CompetitionTeamForm, FixtureStatus, PlayerRole, TeamTypes } from './v2requestData.enums';
import { ILeagueStandings, IV2FootballCompetition, IV2FootballFixture, IV2FootballLiveFixture } from './v2requestData.types';
import { ShortPopulatedCompetition, ShortPopulatedTeam } from './v2requestSubData.types';

// COMPETITION //

// All competitions
export type AllCompData = {
    competitions: IV2FootballCompetition,
    pagination: {
        total: number,
        page: number,
        limit: number,
        pages: number,
    }
};
// Single competition
export interface SingleCompData extends Omit<IV2FootballCompetition, 'teams'> {
    teams: {
        team: { _id: string, name: string, shorthand: string },
        squad: {
            player: { _id: string, name: string },
            jerseyNumber: number,
            isCaptain: boolean,
            position: string
        }[],
    }
}
// Fixtures
export type CompetitionFixtureData = {
    fixtures: PopulatedTeamInFixture,
    pagination: {
        total: number,
        page: number,
        limit: number,
        pages: number,
    }
}
// League table
export type LeagueTableData = {
    _id: string;

    team: { name: string, shorthand: string, academicYear: string, type: TeamTypes, logo: string };
    played: number;
    points: number;
    disciplinaryPoints: number;
    wins: number;
    losses: number;
    draws: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    form: CompetitionTeamForm[];
    position: number;
}
// Knockout rounds
export type KnockoutData = {
    _id: string;

    name: string,
    fixtures: {
        homeTeam: { name: string, shorthand: string, logo: string },
        awayTeam: { name: string, shorthand: string, logo: string },
        stadium: string,
        scheduledDate: Date,
        status: FixtureStatus,
        result: {
            homeScore: { type: Number, default: 0 },
            awayScore: { type: Number, default: 0 },
            halftimeHomeScore: { type: Number, default: null },
            halftimeAwayScore: { type: Number, default: null },
            homePenalty: { type: Number, default: null },
            awayPenalty: { type: Number, default: null }
        }, 
        rescheduledDate: Date,
        postponedReason: string,
    }[],
    completed: boolean,
};
// Groups
export type GroupData = {
    _id: string;

    name: string;
    standings: {
        team: { name: string, shorthand: string, academicYear: string, type: TeamTypes, logo: string };
        played: number;
        points: number;
        disciplinaryPoints: number;
        wins: number;
        losses: number;
        draws: number;
        goalsFor: number;
        goalsAgainst: number;
        goalDifference: number;
        form: CompetitionTeamForm[];
        position: number;
    }[];
    fixtures: {
        homeTeam: { name: string, shorthand: string, logo: string },
        awayTeam: { name: string, shorthand: string, logo: string },
        stadium: string,
        scheduledDate: Date,
        status: FixtureStatus,
        result: {
            homeScore: { type: Number, default: 0 },
            awayScore: { type: Number, default: 0 },
            halftimeHomeScore: { type: Number, default: null },
            halftimeAwayScore: { type: Number, default: null },
            homePenalty: { type: Number, default: null },
            awayPenalty: { type: Number, default: null }
        }, 
        rescheduledDate: Date,
        postponedReason: string,
    }[];
    qualificationRules: {
        position: number,
        destination: 'knockout' | 'playoffs' | 'eliminated',
        knockoutRound: string,
        isBestLoserCandidate: boolean
    }[];
    qualifiedTeams: {
        team: string, // teamID
        originalPosition: number,
        qualifiedAs: string,
        destination: string
    }[];
}
// Team and squad
export type TeamAndSquadData = {
    team: { _id: string, name: string, shorthand: string },
    squad: {
        player: { _id: string, name: string },
        jerseyNumber: number,
        isCaptain: boolean,
        position: string
    }[],
}
// Stats
export type CompetitionStatsData = {
    averageGoalsPerMatch: Number;
    averageAttendance: Number;
    cleanSheets: Number;
    topScorers: {
        player: { name: string; department: string; admissionYear: string };
        team: { name: string; shorthand: string; logo: string; };
        goals: Number;
        penalties: Number;
    }[];
    topAssists: {
        player: { name: string; department: string; admissionYear: string };
        team: { name: string; shorthand: string; logo: string; };
        assists: Number;
    }[];
    bestDefenses: {
        team: { name: string; shorthand: string; logo: string; };
        cleanSheets: Number;
        goalsConceded: Number;
    }[];
}

// END OF COMPETITION //

// LIVE FIXTURES //

// Get all live fixtures
export type AllTodayFix = {
    _id: string;
    homeTeam: ShortPopulatedTeam;
    awayTeam: ShortPopulatedTeam;
    competition: ShortPopulatedCompetition;
    scheduledDate: Date;
    rescheduledDate: Date | null;
    stadium: string;
    status: FixtureStatus.SCHEDULED | FixtureStatus.LIVE | FixtureStatus.COMPLETED | FixtureStatus.POSTPONED | FixtureStatus.CANCELED;
}
// Get live fixture by ID
export type LiveFixData = IV2FootballLiveFixture;
// Get live fixture team players
export type LiveFixPlayerData = {
    homePlayers: {
        _id: string;
        name: string;
        admissionYear: string;
        role: PlayerRole;
        position: string;
        jerseyNumber: number;
    }[];
    awayPlayers: {
        _id: string;
        name: string;
        admissionYear: string;
        role: PlayerRole;
        position: string;
        jerseyNumber: number;
    }[];
}

// END OF LIVE FIXTURES //

// GENERAL //

interface PopulatedTeamInFixture extends Omit<IV2FootballFixture, 'homeTeam' | 'awayTeam'> {
    homeTeam: { name: string; shorthand: string; logo: string; }
    awayTeam: { name: string; shorthand: string; logo: string; }
}

// END OF GENERAL //