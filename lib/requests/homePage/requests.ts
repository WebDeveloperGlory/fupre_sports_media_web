import { getCurrentDate } from "@/constants";
import axiosInstance from "@/lib/config/axiosInstance";

interface CustomError {
    status?: number;
    message?: string;
    response?: {
        data: {
            message: string;
        };
    };
}

const API_URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PROD_API_URL : process.env.NEXT_PUBLIC_DEV_API_URL;

export const getTodaysFixtures = async ( ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/fixture?filterBy=${ getCurrentDate() }&limit=1` );
        const { data } = response;

        if( data.code === '99' ) {
            throw data
        }
        return data;
    } catch( err: any ) {
        const { response } = err as CustomError;

        if( err?.status && err?.message ) {
            console.error( `Error ${ err.status }: `, response?.data.message )
            return null;
        } else {
            console.error('Error fetching fixtures: ', err );
            return null;
        }
    }
}