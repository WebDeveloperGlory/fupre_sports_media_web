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

export const getAllCompetitions = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/competition?limit=${100}`);
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
            console.error('Error fetching competitions: ', err );
            return null;
        }
    }
};

export const getCompetitionById = async ( competitionId: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ competitionId }` );
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
            console.error(' Error Getting Competition: ', err );
            return null;
        }
    }
};

export const getCompetitionTeams= async ( competitionId: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ competitionId }/team` );
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
            console.error(' Error Getting Competition: ', err );
            return null;
        }
    }
};

export const getCompetitionGroups = async ( competitionId: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ competitionId }/group` );
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
            console.error(' Error Getting Competition: ', err );
            return null;
        }
    }
};

export const getCompetitionKnockout = async ( competitionId: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ competitionId }/knockout` );
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
            console.error(' Error Getting Competition: ', err );
            return null;
        }
    }
};

export const getCompetitionLeagueTable = async ( competitionId: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ competitionId }/league-table` );
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
            console.error(' Error Getting Competition: ', err );
            return null;
        }
    }
};

export const getCompetitionFixtures = async ( competitionId: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ competitionId }/fixture` );
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
            console.error(' Error Getting Competition: ', err );
            return null;
        }
    }
};

export const getCompetitionStats = async ( competitionId: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ competitionId }/stat` );
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
            console.error(' Error Getting Competition: ', err );
            return null;
        }
    }
};