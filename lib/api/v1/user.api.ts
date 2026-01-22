import { apiClient } from "@/lib/config/client";
import { CreateAdminDto, UserUpdateDto } from "@/lib/types/v1.payload.types";
import { PaginatedResponse, UserResponse } from "@/lib/types/v1.response.types";

export const userApi = {
    checkUsername: (username: string) => apiClient.get<boolean>(`/v1/user/username?username=${username}`),
    getAll: () => apiClient.get<PaginatedResponse<UserResponse>>('/v1/user'),
    getById: (id: string) => apiClient.get<UserResponse>(`/v1/user/${id}`),
    createAdmin: (payload: CreateAdminDto) => apiClient.post<UserResponse, CreateAdminDto>('/v1/user/admin', payload),
    update: (id: string, payload: Partial<UserUpdateDto>) => apiClient.patch<UserResponse>(`/v1/user/${id}`, payload),
    delete: (id: string) => apiClient.delete<void>(`/v1/user/${id}`)
};