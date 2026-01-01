import axiosInstance from "@/lib/config/axiosInstance";
import { CompetitionAdminCreateFixtureRequestBody, EditPlayerRequestBody } from "@/utils/requestDataTypes";

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

export const getAdminCompetitions = async ( token: string ) => {
    try {
        const response = await axiosInstance.get(
            `${ API_URL }/admin/competitions`,
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

export const getAdminCompetitionDetails = async ( token: string, competitionId: string ) => {
    try {
        const response = await axiosInstance.get(
            `${ API_URL }/admin/competitions/${ competitionId }`,
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

export const getAdminCompetitionFixtures = async ( token: string, competitionId: string ) => {
    try {
        const response = await axiosInstance.get(
            `${ API_URL }/admin/competitions/${ competitionId }/fixtures`,
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

export const createCompetitionFixture = async ( token: string, competitionId: string, updateData: any ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/competition/${competitionId}/fixtures`,
            { fixtures: [ updateData ] },
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
            console.error('Error creating competition: ', err );
            return null;
        }
    }
}

export const getTeamPlayerList = async ( token: string ) => {
    try {
        const response = await axiosInstance.get(
            `${ API_URL }/admin/players`,
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
            console.error('Error fetching player lists: ', err );
            return null;
        }
    }
}

export const createTeamPlayer = async ( token: string, teamId: string, requestBody: any ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/teams/${ teamId }/players`,
            { playerArray: [ requestBody ] },
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
            console.error('Error fetching player lists: ', err );
            return null;
        }
    }
}

export const updateTeamPlayer = async ( token: string, playerId: string, requestBody: any ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/player/${ playerId }`,
            requestBody,
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
            console.error('Error fetching player lists: ', err );
            return null;
        }
    }
}

export const deleteTeamPlayer = async ( token: string, playerId: string ) => {
    try {
        const response = await axiosInstance.delete(
            `${ API_URL }/player/${ playerId }`,
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
            console.error('Error fetching player lists: ', err );
            return null;
        }
    }
}