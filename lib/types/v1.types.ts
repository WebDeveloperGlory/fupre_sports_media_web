export interface ApiErrorResponse {
    success: false;
    error: string;
    code?: string;
    details?: Array<{
        field: string;
        message: string;
    }>;
    field?: string;
}

export interface ApiSuccessResponse<T = any> {
    success: true;
    message: string;
    data?: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiError extends Error {
    constructor(
        public message: string,
        public statusCode: number,
        public code?: string,
        public details?: Array<{ field: string; message: string }>,
        public field?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }

    get fieldErrors(): Record<string, string> {
        if (!this.details) return {};
        return this.details.reduce((acc, err) => ({
            ...acc,
            [err.field]: err.message
        }), {});
    }

    isValidationError(): boolean {
        return this.statusCode === 400 && !!this.details;
    }

    isAuthError(): boolean {
        return this.statusCode === 401 && this.code === 'UNAUTHORIZED';
    }

    isForbiddenError(): boolean {
        return this.statusCode === 403;
    }

    isNotFoundError(): boolean {
        return this.statusCode === 404;
    }

    isConflictError(): boolean {
        return this.statusCode === 409;
    }

    isServerError(): boolean {
        return this.statusCode >= 500;
    }
}