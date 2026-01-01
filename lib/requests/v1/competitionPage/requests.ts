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

const API_URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PROD_API_URL : process.env.NEXT_PUBLIC_DEV_API_URL;

export const getAllCompetitions = async () => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition` );
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

export const getLiveFixture = async () => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/fixture?live=true` );
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
            console.error('Error fetching live fixtures array: ', err );
            return null;
        }
    }
}

export const getIndividualCompetition = async ( id: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ id }` );
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

export const getIndividualCompetitionOverview = async ( id: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ id }/overview` );
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

export const getLeagueTable = async ( id: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ id }/league-table` );
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

export const getTopPlayers = async ( id: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ id }/top-players` );
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

export const getTopTeams = async ( id: string, type: string = 'average' ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ id }/top-teams?statType=${ type }` );
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

export const getAllTeamStats = async ( id: string, type: string = 'average' ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ id }/team-stats?statType=${ type }` );
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

export const getAllPlayerStats = async ( id: string, page: number, limit: number, teamId: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ id }/player-stats?page=${ page }&limit=${ limit }${ teamId ? `&teamId=${ teamId }` : '' }` );
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

export const getAllCompetitionFixtures = async ( id: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ id }/fixtures` );
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

export const getRecentFixtures = async ( limit: number = 5 ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/fixture?status=completed&limit=${ limit }&sort=-scheduledDate` );
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
            console.error('Error fetching recent fixtures: ', err );
            return null;
        }
    }
}

export const getKnockoutRounds = async (id: string) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/competition/${id}/knockout/phases`);
        const { data }: { data: SuccessRequest } = response;

        if (data.code === '99') {
            throw data;
        }
        return data;
    } catch (err: any) {
        const { response } = err as CustomError;

        if (err?.status && err?.message) {
            console.error(`Error ${err.status}: `, response?.data.message);
            return response?.data || null;
        } else {
            console.error('Error fetching knockout rounds: ', err);
            return null;
        }
    }
};