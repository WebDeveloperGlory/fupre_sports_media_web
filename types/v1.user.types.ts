export interface UserProps {
    id: string;
    name: string;
    username?: string;
    email: string;
    password: string;
    role: UserRole;
    permissions: UserPermissions[];
    sport: SportType;
    status: UserStatus;
    otp: string | null;
    otpExpiresAt: Date | null;
    lastLogin: Date | null;
    passwordChangedAt: Date | null;
    preferences: UserPreference;
    isFantasyRegistered: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type UserPreference = {
    notifications: {
        inApp: boolean;
        email: boolean;
        fantasyUpdates: boolean;
    }
}

export enum UserRole {
    USER = 'user',
    SUPER_ADMIN = 'super-admin',
    TENANT_ADMIN = 'tenant-admin',
    LIVE_ADMIN = 'live-admin'
}

export enum UserPermissions {
    LEAGUE_MANAGEMENT = 'MANAGE_LEAGUES',
    TEAM_MANAGEMENT = 'MANAGE_TEAMS',
    PLAYER_MANAGEMENT = 'MANAGE_PLAYERS',
    MEDIA_PUBLICATION = 'PUBLISH_MEDIA',
    FIXTURE_MANAGEMENT = 'MANAGE_FIXTURES',
    LIVE_MANAGEMENT = 'GO_LIVE',
    RESULT_EDITING = 'EDIT_RESULTS'
}

export enum SportType {
    FOOTBALL = 'football',
    BASKETBALL = 'basketball',
    VOLLEYBALL = 'volleyball',
    ALL = 'all'
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended'
}