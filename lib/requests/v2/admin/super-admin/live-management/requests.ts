import axiosInstance from "@/lib/config/axiosInstance";
import { Cheer, LiveFixLineupForm, LiveFixScore, LiveFixStatForm, LiveFixStatusForm, LiveFixSubCreate, LiveFixSubEdit, LiveFixTimelineCreate, LiveFixTimelineEdit, LivFixGeneralUpdates, LivFixGoalScorer, LivFixPlayerRatingOfficial, LivFixPOTMOfficial, LivFixTimeUpdates, UserPlayerRating } from "@/utils/V2Utils/formData";

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

export const updateLiveFixtureStatistics = async ( fixtureId: string, formData: LiveFixStatForm ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/stats/update`, 
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

export const updateLiveFixtureStatus = async ( fixtureId: string, formData: LiveFixStatusForm ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/status/update`, 
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

export const updateFixtureScore = async ( fixtureId: string, formData: LiveFixScore ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/score/update`, 
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

export const generalUpdates = async ( fixtureId: string, formData: LivFixGeneralUpdates ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/general/update`, 
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

export const updateTime = async ( fixtureId: string, formData: LivFixTimeUpdates ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/time/update`, 
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

export const createTimeLineEvent = async ( fixtureId: string, formData: LiveFixTimelineCreate ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/timeline/add`, 
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

export const editTimelineEvent = async ( fixtureId: string, formData: LiveFixTimelineEdit ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/timeline/edit`, 
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

export const deleteTimelineEvent = async ( fixtureId: string, formData: { eventId: string } ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/timeline/delete`, 
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

export const addSubstitution = async ( fixtureId: string, formData: LiveFixSubCreate ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/substitution/add`, 
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

export const updateSubstitution = async ( fixtureId: string, formData: LiveFixSubEdit ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/substitution/edit`, 
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

export const removeSubstitution = async ( fixtureId: string, formData: { substitutionId: string } ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/substitution/delete`, 
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

export const addGoalScorer = async ( fixtureId: string, formData: LivFixGoalScorer ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/goalscorer/add`, 
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

export const removeGoalScorer = async ( fixtureId: string, formData: { goalScorerId: string } ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/goalscorer/delete`, 
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

export const updateOfficialPOTM = async ( fixtureId: string, formData: LivFixPOTMOfficial ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/admin/potm/submit`, 
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

export const updateOfficialPlayerRatings = async ( fixtureId: string, formData: LivFixPlayerRatingOfficial ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/admin/player-rating/submit`, 
            { ratings: [ formData ] },
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

export const submitUserPlayerRating = async ( fixtureId: string, formData: UserPlayerRating ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/user/player-rating/submit`, 
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

export const submitUserPOTMVote = async ( fixtureId: string, formData: { playerId: string } ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/user/potm/submit`, 
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

export const submitOfficialCheer = async ( fixtureId: string, formData: Cheer ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/user/cheeer/official`, 
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

export const submitUnofficialCheer = async ( fixtureId: string, formData: Cheer ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live/${fixtureId}/user/cheer/unofficial`, 
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