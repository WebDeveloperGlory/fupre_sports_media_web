import axiosInstance from "@/lib/config/axiosInstance";
import { LiveMatchUpdateRequestBody } from "@/utils/requestDataTypes";

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

interface LineUp {
    formation: string,
    startingXI: string[],
    subs: string[]
}

const API_URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PROD_API_URL : process.env.NEXT_PUBLIC_DEV_API_URL;

export const getAllTodayFixturesAdmin = async ( token: string ) => {
    try {
        const response = await axiosInstance.get(
            `${ API_URL }/live-fixtures/fixtures`,
            {
                headers: {
                    Authorization: `Bearer ${ token }`
                },
                withCredentials: true
            }
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
            console.error('Error fetching competitions: ', err );
            return null;
        }
    }
}

export const initializeLiveFixture = async ( fixtureId: string, token: string ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/live-fixtures/initialize`,
            fixtureId,
            {
                headers: {
                    Authorization: `Bearer ${ token }`
                },
                withCredentials: true
            }
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
            console.error('Error fetching competitions: ', err );
            return null;
        }
    }
}

export const updateFixtureFormation = async ( fixtureId: string, homeLineup: LineUp, awayLineup: LineUp, token: string ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/fixture/${ fixtureId }/formation`,
            { homeLineup, awayLineup },
            {
                headers: {
                    Authorization: `Bearer ${ token }`
                },
                withCredentials: true
            }
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
            console.error('Error fetching competitions: ', err );
            return null;
        }
    }
}

export const updateLiveFixture = async ( fixtureId: string, updateData: LiveMatchUpdateRequestBody ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/live-fixtures/update/${ fixtureId }`,
            updateData,
            {

            }
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
            console.error('Error fetching competitions: ', err );
            return null;
        }
    }
}