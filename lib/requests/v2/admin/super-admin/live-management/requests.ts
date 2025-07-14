import axiosInstance from "@/lib/config/axiosInstance";
import { LiveFixLineupForm } from "@/utils/V2Utils/formData";
import { TeamTypes } from "@/utils/V2Utils/v2requestData.enums";

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

export const getLiveFixtureAdmins = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/admin/live-fixture`);
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
            console.error('Error fetching live admin list: ', err );
            return null;
        }
    }
};

export const getAllTodayFixtures = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/fixture/today`);
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
            console.error('Error fetching departments: ', err );
            return null;
        }
    }
};

export const getAllLiveFixtures = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/live`);
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
            console.error('Error fetching departments: ', err );
            return null;
        }
    }
};
export const getLiveFixtureById = async ( fixtureId: string ) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/live/${fixtureId}`);
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
            console.error('Error fetching departments: ', err );
            return null;
        }
    }
};
export const getLiveFixtureTeamPlayers = async ( fixtureId: string ) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/live/${fixtureId}/players`);
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
            console.error('Error fetching departments: ', err );
            return null;
        }
    }
};

export const rescheduleFixture = async ( fixtureId: string, postponedReason: string, rescheduledDate: string ) => {
    try {
        const response = await axiosInstance.put(
            `${API_URL}/fixture/${fixtureId}/reschedule`,
            { postponedReason, rescheduledDate },
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
            console.error('Error fetching teams: ', err );
            return null;
        }
    }
};

export const initiateLiveFixture = async ( fixtureId: string, adminId: string ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/live`, 
            { fixtureId, adminId },
            { withCredentials: true }
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
            console.error('Signup Error: ', err );
            return null;
        }
    }
}

export const updateLiveFixtureLineup = async ( fixtureId: string, formData: LiveFixLineupForm ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/lineups/update`, 
            formData,
            { withCredentials: true }
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
            console.error('Signup Error: ', err );
            return null;
        }
    }
}