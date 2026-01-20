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