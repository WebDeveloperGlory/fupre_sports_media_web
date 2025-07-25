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

export const getHeadMediaAdminDashboard = async () => {
    try {
        const response = await axiosInstance.get(
            `${API_URL}/views/media-admin/dashboard`,
            {
                withCredentials: true,
            }
        );
        const { data }: { data: SuccessRequest } = response;

        if (data.code === '99') {
            throw data;
        }

        return data;
    } catch( err: any ) {
        const { response } = err as CustomError;
        console.log( err, response );

        if( err?.status && err?.message ) {
            console.error( `Error ${ err.status }: `, response?.data.message )
            return response?.data || null;
        } else {
            console.error('Error fetching super admin football dashboard: ', err );
            return null;
        }
    }
};

export const getHeadMediaAdminFixturesForRating = async () => {
    try {
        const response = await axiosInstance.get(
            `${API_URL}/views/media-admin/potm-fixtures`,
            {
                withCredentials: true,
            }
        );
        const { data }: { data: SuccessRequest } = response;

        if (data.code === '99') {
            throw data;
        }

        return data;
    } catch( err: any ) {
        const { response } = err as CustomError;
        console.log( err, response );

        if( err?.status && err?.message ) {
            console.error( `Error ${ err.status }: `, response?.data.message )
            return response?.data || null;
        } else {
            console.error('Error fetching super admin football dashboard: ', err );
            return null;
        }
    }
};