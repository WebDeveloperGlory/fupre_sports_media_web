import { PlayerPosition } from "./v1.football-player.types";

export interface CompetitionProps {
    id?: string;
    name: string;
    shorthand: string;
    type: CompetitionType;
    logo: string | null;
    coverImage: string | null;
    description: string;
    status: CompetitionStatus;
    teams: string[];
    teamRegistrations: CompetitionTeamReg[];
    leagueTable: LeagueStanding[] | null;
    knockoutRounds: KnockoutRound[] | null;
    groupStage: GroupTable[] | null;
    season: string;
    startDate: Date;
    endDate: Date;
    registrationDeadline: Date | null;
    currentMatchWeek: number;
    currentStage: string | null;
    rules: Rules;
    extraRules: ExtraRule[];
    sponsors: Sponsor[];
    isActive: boolean;
    isFeatured: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum CompetitionType {
    LEAGUE = 'league',
    KNOCKOUT = 'knockout',
    HYBRID = 'hybrid'
}

export enum CompetitionSponsor {
    MAIN = 'main',
    OFFICIAL = 'official',
    PARTNER = 'partner'
}

export enum CompetitionTeamForm {
    WIN = 'W',
    LOSS = 'L',
    DRAW = 'D'
}

export enum CompetitionStatus {
    UPCOMING = 'upcoming',
    COMPLETED = 'completed',
    ONGOING = 'ongoing',
    CANCELLED = 'cancelled'
}

export type Sponsor = {
    name: string;
    logo: string | null;
    tier: CompetitionSponsor;
}

export type ExtraRule = {
    title: string;
    description: string;
    lastUpdated: Date;
}

export type Rules = {
    substitutions: {
        allowed: boolean;
        maximum: number;
    };
    extraTime: boolean;
    penalties: boolean;
    matchDuration: {
        normal: number;
        extraTime: number;
    };
    squadSize: {
        min: number;
        max: number
    },
}

export type CompetitionTeamReg = {
    team: string;
    registeredDate: Date;
    squad: {
        player: string;
        jerseyNumber: number;
        isCaptain: boolean;
        position: PlayerPosition;
    }[];
}

export type LeagueStanding = {
    id: string;
    team: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    disciplinaryPoints: number;
    bonusPoints: number;
    form: CompetitionTeamForm[];
    position: number;
    previousPosition: number;
    positionChange: number; // +1, -2,(et cetra)
    yellowCards: number;
    redCards: number;
    lastUpdated: Date;
}

export type KnockoutRound = {
    id: string;
    name: string;
    roundNumber: number;
    fixtures: string[];
    completed: boolean;
}

export type GroupTable = {
    id: string;
    name: string;
    groupNumber: number;
    standings: LeagueStanding[];
    fixtures: string[];
    qualificationRules: {
        position: number;
        destination: 'knockout' | 'playoffs' | 'eliminated';
        description: string;
        isBestLoserCandidate: boolean;
    }[];
    qualifiedTeams: {
        team: string;
        originalPosition: number;
        qualifiedAs: string;
        destination: string;
    }[];
    completed: boolean;
    matchesPlayed: number;
    totalMatches: number;
}