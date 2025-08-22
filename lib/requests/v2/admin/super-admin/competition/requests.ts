import axiosInstance from "@/lib/config/axiosInstance";
import { CompFormFixture } from "@/utils/V2Utils/formData";

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

export const createCompetitionFixture = async ( fixtureData: CompFormFixture, competitionId: string ) => {
    try {
        const response = await axiosInstance.put(
            `${API_URL}/competition/${competitionId}/fixture`,
            fixtureData,
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
            console.error('Error creating fixture: ', err );
            return null;
        }
    }
};