import { getCurrentDate } from "@/constants";
import axiosInstance from "@/lib/config/axiosInstance";

interface CustomError {
    status?: number;
    message?: string;
    response?: {
        data: {
            message: string,
            code: string,
            data?: any
        };
    };
}

interface SuccessRequest {
    code: string,
    message: string,
    data?: any
}

const API_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

export const getGeneralInfo = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/general`);
        const { data }: { data: SuccessRequest } = response;

        if (data.code === '99') {
            throw data;
        }

        return data;
    } catch (error) {
        const err = error as CustomError;
        if (err.response) {
            return err.response.data;
        }
        return {
            code: '99',
            message: 'Something went wrong',
            data: null
        };
    }
};

export const getTodaysFixtures = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/fixture?filterBy=${getCurrentDate()}&limit=1`);
        const { data }: { data: SuccessRequest } = response;

        if (data.code === '99') {
            throw data;
        }

        return data;
    } catch (error) {
        const err = error as CustomError;
        if (err.response) {
            return err.response.data;
        }
        return {
            code: '99',
            message: 'Something went wrong',
            data: null
        };
    }
};