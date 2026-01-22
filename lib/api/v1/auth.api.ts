import { apiClient } from "@/lib/config/client";
import { tokenManager } from "@/lib/config/token-manager";
import { CreateUserDto, LoginDto, RequestOTPDto, VerifyOTPDto } from "@/lib/types/v1.payload.types";
import { LoginResponse, UserResponse } from "@/lib/types/v1.response.types";

export const authApi = {
    registerUser: async(payload: CreateUserDto) => {
        const response = await apiClient.post<UserResponse, CreateUserDto>('/v1/user/regular', payload);
        return response;
    },

    login: async (payload: LoginDto) => {
        const response = await apiClient.post<LoginResponse, LoginDto>('/v1/auth/login', payload);
        tokenManager.setToken(response.data.token);
        return response;
    },

    logout: () => {
        tokenManager.removeToken();
    },

    isAuthenticated: () => tokenManager.hasToken(),

    getCurrentUser: () => apiClient.get<UserResponse>('/v1/auth/me'),

    uploadAvatar: (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        return apiClient.post<UserResponse, FormData>('/v1/auth/me/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    requestOTP: async (payload: RequestOTPDto) => await apiClient.post<void, RequestOTPDto>('/v1/auth/otp/send', payload),
    
    verifyOTP: async (payload: VerifyOTPDto) => {
        const response = await apiClient.post<LoginResponse, VerifyOTPDto>('/v1/auth/otp/verify', payload);
        tokenManager.setToken(response.data.token);
        return response;
    }
};