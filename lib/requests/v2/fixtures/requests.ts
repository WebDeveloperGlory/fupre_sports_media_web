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

const PART_API_URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PROD_API_URL : process.env.NEXT_PUBLIC_DEV_PARTIAL_API_URL;
const API_URL = process.env.NEXT_PUBLIC_DEV_MODE === 'partial' ? PART_API_URL : `${PART_API_URL}/v2`;

export const getFixtures = async (status?: string, limit: number = 50) => {
    try {
        let url = `${API_URL}/fixture?limit=${limit}&sort=-scheduledDate`;
        if (status) {
            url += `&status=${status}`;
        }

        const response = await axiosInstance.get(url);
        const { data }: { data: SuccessRequest } = response;

        if (data.code === '99') {
            throw data;
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
};

export const getUpcomingFixtures = async (limit: number = 50) => {
    return getFixtures('scheduled', limit);
};

export const getCompletedFixtures = async (limit: number = 50) => {
    return getFixtures('completed', limit);
};

export const getFixturesByCompetition = async (competitionId: string, status?: string, limit: number = 50) => {
    try {
        let url = `${API_URL}/fixture?competition=${competitionId}&limit=${limit}&sort=-scheduledDate`;
        if (status) {
            url += `&status=${status}`;
        }

        const response = await axiosInstance.get(url);
        const { data }: { data: SuccessRequest } = response;

        if (data.code === '99') {
            throw data;
        }

        return data;
    } catch( err: any ) {
        const { response } = err as CustomError;

        if( err?.status && err?.message ) {
            console.error( `Error ${ err.status }: `, response?.data.message )
            return response?.data || null;
        } else {
            console.error('Error fetching fixtures by competition: ', err );
            return null;
        }
    }
};

export const getFixtureById = async (fixtureId: string) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/fixture/single/${fixtureId}`);
        const { data }: { data: SuccessRequest } = response;

        if (data.code === '99') {
            throw data;
        }

        return data;
    } catch( err: any ) {
        const { response } = err as CustomError;

        if( err?.status && err?.message ) {
            console.error( `Error ${ err.status }: `, response?.data.message )
            return response?.data || null;
        } else {
            console.error('Error fetching fixture by id: ', err );
            return null;
        }
    }
};
