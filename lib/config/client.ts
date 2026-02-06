import { AxiosRequestConfig } from 'axios';
import axiosInstance from './newAxiosInstance';
import { ApiError } from '../types/v1.types';
import { APIResponse, DeleteAPIResponse, PaginatedResponse } from '../types/v1.response.types';

type ErrorHandler = (error: ApiError) => void;

class ApiClient {
    private globalErrorHandler?: ErrorHandler;

    setGlobalErrorHandler(handler: ErrorHandler) {
        this.globalErrorHandler = handler;
    }

    private handleError(error: unknown): never {
        if (error instanceof ApiError) {
            this.globalErrorHandler?.(error);
            throw error;
        }
        throw error;
    }

    private shouldRetryWithFallback(error: unknown): boolean {
        if (!(error instanceof ApiError)) return false;
        if (!error.isNotFoundError()) return false;
        return error.message.toLowerCase().includes("route not found");
    }

    private getFallbackUrl(url: string): string | null {
        const replacements = [
            { from: "/v1/football/competition", to: "/v1/football/competitions" },
            { from: "/v1/football/fixture", to: "/v1/football/fixtures" },
            { from: "/v1/football/team", to: "/v1/football/teams" },
            { from: "/v1/football/player", to: "/v1/football/players" },
            { from: "/v1/football/live-fixture", to: "/v1/football/live-fixtures" },
            { from: "/v1/football/player-stat", to: "/v1/football/player-stats" },
            { from: "/v1/football/potm-vote", to: "/v1/football/potm-votes" },
            { from: "/v1/uni-management/faculty", to: "/v1/uni-management/faculties" },
            { from: "/v1/uni-management/department", to: "/v1/uni-management/departments" },
        ];

        for (const replacement of replacements) {
            if (url.includes(replacement.from) && !url.includes(replacement.to)) {
                return url.replace(replacement.from, replacement.to);
            }
        }

        return null;
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
        try {
            const response = await axiosInstance.get<T>(url, config);
            return response.data as APIResponse<T>;
        } catch (error) {
            if (this.shouldRetryWithFallback(error)) {
                const fallbackUrl = this.getFallbackUrl(url);
                if (fallbackUrl) {
                    return this.get<T>(fallbackUrl, config);
                }
            }
            return this.handleError(error);
        }
    }

    async getPaginated<T>(url: string, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> {
        try {
            const response = await axiosInstance.get(url, config);
            return response.data as PaginatedResponse<T>;
        } catch (error) {
            if (this.shouldRetryWithFallback(error)) {
                const fallbackUrl = this.getFallbackUrl(url);
                if (fallbackUrl) {
                    return this.getPaginated<T>(fallbackUrl, config);
                }
            }
            return this.handleError(error);
        }
    }


    async post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
        try {
            const response = await axiosInstance.post<T>(url, data, config);
            return response.data as APIResponse<T>;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
        try {
            const response = await axiosInstance.put<T>(url, data, config);
            return response.data as APIResponse<T>;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async patch<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
        try {
            const response = await axiosInstance.patch<T>(url, data, config);
            return response.data as APIResponse<T>;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<DeleteAPIResponse> {
        try {
            const response = await axiosInstance.delete<T>(url, config);
            return response.data as DeleteAPIResponse;
        } catch (error) {
            return this.handleError(error);
        }
    }
}

export const apiClient = new ApiClient();

// Auto-redirect on auth errors
if (typeof window !== 'undefined') {
    apiClient.setGlobalErrorHandler((error) => {
        if (error.isAuthError()) {
            window.location.href = '/new-auth/login';
        }
    });
}
