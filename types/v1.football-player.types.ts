export interface FootballPlayer {
    id: string;
    name: string;
    department: string;
    admissionYear: string;
    weight?: number;
    height?: number;
    nationality: string;
    preferredFoot: PlayerFavoriteFoot;
    naturalPosition: PlayerPosition;
    photo: string | null;
    marketValue: number | null;
    awards: {
        title: string,
        season: string,
        date: Date,
        description: string
    }[];
    createdBy: string;
    verifiedBy?: string;
    verificationStatus: PlayerVerificationStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface FootballPlayerContract {
    id: string;
    player: string;
    team: string;
    startDate: Date;
    endDate: Date | null;
    contractType: PlayerContractType;
    position: PlayerPosition;
    jerseyNumber: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PlayerSeasonStat {
    id: string;
    player: string;
    team: string;
    season: string;
    competition: string | null;
    type: PlayerSeasonStatType;
    stats: Stats;
    createdAt: Date;
    updatedAt: Date;
}

export interface FootballPlayerCareerStats {
    id: string;
    player: string;
    appearances: number;
    totalGoals: number;
    totalAssists: number;
    totalCleanSheets: number;
    totalYellowCards: number;
    totalRedCards: number;
    totalMOTM: number;
    minutesPlayed: number;
    createdAt: Date;
    updatedAt: Date;
}

export enum PlayerSeasonStatType {
    COMPETITION = 'competition',
    FRIENDLY = 'friendly',
}

export type Stats = {
    appearances: number;
    goals: number;
    assists: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
    MOTM: number;
    minutesPlayed: number;
}

export enum PlayerVerificationStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected',
}

export enum PlayerFavoriteFoot {
    LEFT = 'left',
    RIGHT = 'right',
    BOTH = 'both',
}

export enum PlayerPosition {
    GK = 'gk',
    LB = 'lb',
    RB = 'rb',
    CB = 'cb',
    AM = 'am',
    CM = 'cm',
    LM = 'lm',
    RM = 'rm',
    RW = 'rw',
    LW = 'lw',
    SS = 'ss',
    CF = 'cf',
}

export enum PlayerContractType {
    PERMANENT = 'permanent',
    ON_LOAN = 'on-loan',
    TRIAL = 'trial',
}