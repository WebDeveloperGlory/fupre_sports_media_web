import axiosInstance from "@/lib/config/axiosInstance";
import { PlayerCreateFormDetails, PlayerUpdateDetails, PlayerVerificationDetails, TeamAssignmentDetails, UnverifiedPlayerReg } from "@/utils/V2Utils/formData";

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

const PART_API_URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PROD_API_URL : process.env.NEXT_PUBLIC_DEV_PARTIAL_API_URL;
const API_URL = process.env.NEXT_PUBLIC_DEV_MODE === 'partial' ? PART_API_URL : `${PART_API_URL}/v2`;

export const getTeamSuggestedPlayers = async ( teamId: string ) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/player/suggested?teamId=${teamId}`);
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
            console.error('Error fetching team suggested players: ', err );
            return null;
        }
    }
};
export const getPlayerById = async ( playerId: string ) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/player/details/${playerId}`);
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
            console.error('Error fetching player by id: ', err );
            return null;
        }
    }
};

export const createPlayer = async ( formData: PlayerCreateFormDetails ) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/player/register/verified`,
            formData,
            { withCredentials: true }
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
            console.error('Error creating players: ', err );
            return null;
        }
    }
};

export const registerUnverifiedPlayer = async ( formData: UnverifiedPlayerReg ) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/player/register/unverified`,
            formData,
            { withCredentials: true }
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
            console.error('Error creating players: ', err );
            return null;
        }
    }
};

export const updatePlayer = async ( playerId: string, formData: PlayerUpdateDetails ) => {
    try {
        const response = await axiosInstance.put(
            `${API_URL}/player/${playerId}/update`,
            formData,
            { withCredentials: true }
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
            console.error('Error creating players: ', err );
            return null;
        }
    }
};

export const verifyPlayerRegistration = async ( playerId: string, formData: PlayerVerificationDetails ) => {
    try {
        const response = await axiosInstance.put(
            `${API_URL}/player/${playerId}/verify-registration`,
            formData,
            { withCredentials: true }
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
            console.error('Error creating players: ', err );
            return null;
        }
    }
};

export const addPlayerToTeam = async ( playerId: string, formData: TeamAssignmentDetails ) => {
    try {
        const response = await axiosInstance.put(
            `${API_URL}/player/${playerId}/team-registration`,
            formData,
            { withCredentials: true }
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
            console.error('Error creating players: ', err );
            return null;
        }
    }
};