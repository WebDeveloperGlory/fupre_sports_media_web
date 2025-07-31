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

const PART_API_URL = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_PROD_API_URL 
    : process.env.NEXT_PUBLIC_DEV_PARTIAL_API_URL;
const API_URL = process.env.NEXT_PUBLIC_DEV_MODE === 'partial' 
    ? PART_API_URL 
    : `${PART_API_URL}/v2`;
    
export const getHomepageData = async () => {
    try {
        const response = await axiosInstance.get(
            `${API_URL}/views/pages/homepage`,
        );
        const { data }: { data: SuccessRequest } = response;

        if( data.code === '99' ) {
            throw data
        }
        return data;
    } catch( err: any ) {
        const { response } = err as CustomError;

        if( err?.status && err?.message ) {
            console.error( `Error ${ err.status }: `, response?.data.message )
            return response?.data || null;
        } else {
            console.error('Error fetching fixtures: ', err );
            return null;
        }
    }
}

export const getCompetitionpageData = async () => {
    try {
        const response = await axiosInstance.get(
            `${API_URL}/views/pages/competition`,
        );
        const { data }: { data: SuccessRequest } = response;

        if( data.code === '99' ) {
            throw data
        }
        return data;
    } catch( err: any ) {
        const { response } = err as CustomError;

        if( err?.status && err?.message ) {
            console.error( `Error ${ err.status }: `, response?.data.message )
            return response?.data || null;
        } else {
            console.error('Error fetching fixtures: ', err );
            return null;
        }
    }
}

export const getFootballCompetitionPageData = async () => {
    try {
        const response = await axiosInstance.get(
            `${API_URL}/views/pages/competition/football`,
        );
        const { data }: { data: SuccessRequest } = response;

        if( data.code === '99' ) {
            throw data
        }
        return data;
    } catch( err: any ) {
        const { response } = err as CustomError;

        if( err?.status && err?.message ) {
            console.error( `Error ${ err.status }: `, response?.data.message )
            return response?.data || null;
        } else {
            console.error('Error fetching fixtures: ', err );
            return null;
        }
    }
}