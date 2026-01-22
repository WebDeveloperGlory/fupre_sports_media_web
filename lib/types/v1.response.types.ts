import { SportType, UserPermissions, UserPreference, UserRole, UserStatus } from "@/types/v1.user.types";

export interface PaginatedResponse<T> {
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