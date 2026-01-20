import axios, { AxiosError } from 'axios';
import { tokenManager } from './token-manager';
import { ApiError, ApiErrorResponse } from '../types/v1.types';

const API_URL = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_NEW_PROD_API_URL
    : process.env.NEXT_PUBLIC_NEW_DEV_API_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add Bearer token to all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = tokenManager.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle errors and retries
axiosInstance.interceptors.response.use(
    response => response,
    async (error: AxiosError<ApiErrorResponse>) => {
        const { config, response } = error;

        // Clear token on 401
        if (response?.status === 401) {
            tokenManager.removeToken();
        }

        // Retry logic for cold starts (but not auth errors)
        const isRenderColdStart = !response || [502, 503, 504].includes(response.status);
        const shouldRetry = config && isRenderColdStart && (!config._retryCount || config._retryCount < 3);

        if (shouldRetry) {
            config._retryCount = (config._retryCount || 0) + 1;
            const delay = Math.pow(2, config._retryCount - 1) * 1000;
            console.warn(`Render cold start detected. Retry ${config._retryCount}/3 in ${delay}ms`);
            await new Promise(res => setTimeout(res, delay));
            return axiosInstance(config);
        }

        // Transform errors
        if (response?.data) {
            const errorData = response.data;
            throw new ApiError(
                errorData.error || 'An error occurred',
                response.status,
                errorData.code,
                errorData.details,
                errorData.field
            );
        }

        throw new ApiError(error.message || 'Network error', response?.status || 500);
    }
);

declare module 'axios' {
    export interface AxiosRequestConfig {
        _retryCount?: number;
    }
}

export default axiosInstance;