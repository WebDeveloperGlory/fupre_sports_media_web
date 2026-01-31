import { PlayerContractType, PlayerFavoriteFoot, PlayerPosition, PlayerSeasonStatType, PlayerVerificationStatus } from "@/types/v1.football-player.types";
import { UserPermissions, UserRole } from "@/types/v1.user.types";

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
}

export interface CreateAdminDto {
    name: string;
    email: string;
    role: UserRole;
    permissions: UserPermissions[];
    password: string;
}

export interface UserUpdateDto {
    username: string;
    name: string;
    preferences: {
        notifications: {
            inApp: boolean;
            email: boolean;
            fantasyUpdates: boolean;
        };
    };
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface VerifyOTPDto {
    email: string;
    otp: string;
}

export interface RequestOTPDto {
    email: string;
}

export interface UpdatePlayerDto {
    name?: string,
    admissionYear?: string,
    weight?: number,
    height?: number,
    nationality?: string,
    preferredFoot?: PlayerFavoriteFoot,
    naturalPosition?: PlayerPosition,
    marketValue?: number,
}

export interface CreatePlayerDto {
    name: string;
    department: string;
    admissionYear: string;
    nationality: string;
    preferredFoot: PlayerFavoriteFoot;
    naturalPosition: PlayerPosition;
    verificationStatus: PlayerVerificationStatus;
    weight?: number;
    height?: number;
    marketValue?: number;
}

export interface AwardPlayerDto {
    title: string;
    season: string;
    description: string;
}

export interface CreatePlayerContract {
    team: string;
    startDate: Date;
    endDate: Date | null;
    contractType: PlayerContractType;
    position: PlayerPosition;
    jerseyNumber: number;
}

export interface UpdateCareerStatsDto {
    appearances?: number;
    totalGoals?: number;
    totalAssists?: number;
    totalCleanSheets?: number;
    totalYellowCards?: number;
    totalRedCards?: number;
    totalMOTM?: number;
    minutesPlayed?: number;
}

export interface UpdateSeasonStatsDto {
    team: string;
    season: string;
    competition: string | null;
    type: PlayerSeasonStatType;
    minutesPlayed: number;
    goals: number;
    assists: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
    MOTM: number;
}

export interface RequestTeamPlayerStatsDto {
    players: string[];
    season?: string;
}

export interface CreateFootballTeamDto {

}

export interface UpdateFootballTeamDto {
    name?: string;
    shorthand?: string;
    primaryColor?: string;
    secondaryColor?: string;
}