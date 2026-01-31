import { PlayerContractType, PlayerFavoriteFoot, PlayerPosition, PlayerSeasonStatType, PlayerVerificationStatus } from "@/types/v1.football-player.types";
import { CoachRoles, PerformanceStats, TeamColor, TeamTypes } from "@/types/v1.football-team.types";
import { SportType, UserPermissions, UserPreference, UserRole, UserStatus } from "@/types/v1.user.types";

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface APIResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface DeleteAPIResponse {
    success: boolean;
    message: string;
}

export interface LoginResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
        permissions: UserPermissions[];
    };
    token: string;
}

export interface UserResponse {
    id: string;
    name: string;
    username: string | undefined;
    email: string;
    role: UserRole;
    avatar: string;
    permissions: UserPermissions[];
    sport: SportType;
    status: UserStatus;
    lastLogin: Date | null;
    passwordChangedAt: Date | null;
    preferences: UserPreference;
    isFantasyRegistered: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface FootballPlayerResponse {
    id: string;
    name: string;
    department: {
        _id: string;
        name: string;
        code: string;
    };
    admissionYear: number;
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
    verificationStatus: PlayerVerificationStatus;
    createdAt: Date;
}

export interface FootballPlayerContractResponse {
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
}

export interface PlayerSeasonStatResponse {
    id: string;
    player: {
        _id: string;
        name: string;
        department: {
            name: string;
            code: string;
        };
        nationality: string;
        photo: string | null;
    };
    team: {
        _id: string;
        name: string;
        shorthand: string;
        logo: string;
    };
    season: string;
    type: PlayerSeasonStatType;
    competition: {

    } | null;
    stats: Stats;
    createdAt: Date;
}

export interface PlayerCareerStatResponse {
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
}

export interface DepartmentResponse {
    id: string;
    name: string;
    code: string;
    faculty: string; // Faculty ID
    createdAt: Date;
}

export interface FacultyResponse {
    id: string;
    name: string;
    code: string;
    createdAt: Date;
}

export interface FootballTeamResponse {
    id: string;
    name: string;
    shorthand: string;
    logo: string | null;
    faculty: {
        _id: string;
        name: string;
        code: string;
    } | null;
    department: {
        _id: string;
        name: string;
        code: string;
    } | null;
    type: TeamTypes;
    colors: TeamColor;
    academicYear: string;
    stats: PerformanceStats;
    coaches: {
        name: string;
        role: CoachRoles;
    }[];
    admin: string | null;
    createdAt: Date;
}