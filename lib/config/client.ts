import { AxiosRequestConfig } from 'axios';
import axiosInstance from './newAxiosInstance';
import { ApiError } from '../types/v1.types';
import { APIResponse, DeleteAPIResponse } from '../types/v1.response.types';

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

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
        try {
            const response = await axiosInstance.get<T>(url, config);
            return response.data as APIResponse<T>;
        } catch (error) {
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