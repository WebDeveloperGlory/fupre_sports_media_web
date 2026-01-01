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

export const getAllUpcomingFixturesAdmin = async ( token: string ) => {
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

export const getLiveFixtureDetails = async ( fixtureId: string ) => {
    try {
        const response = await axiosInstance.get(
            `${ API_URL }/live-fixtures/fixtures/${fixtureId}`,
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
            console.error('Error fetching live fixture: ', err );
            return null;
        }
    }
}

export const getAllLiveAdmins = async ( token: string ) => {
    try {
        const response = await axiosInstance.get(
            `${ API_URL }/live-fixtures/admins`,
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

export const getAllPossibleAdminLiveFixtures = async ( token: string ) => {
    try {
        const response = await axiosInstance.get(
            `${ API_URL }/live-fixtures/admins/live`,
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

export const initializeLiveFixture = async ( fixtureId: string, adminId: string, token: string ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/live-fixtures/initialize`,
            { fixtureId, adminId },
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

export const endLiveFixture = async ( fixtureId: string, token: string ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/live-fixtures/finalize`,
            { fixtureId },
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
            console.error('Error ending live: ', err );
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

export const updateLiveFixtureFormation = async ( fixtureId: string, homeLineup: LineUp, awayLineup: LineUp, token: string ) => {
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

export const updateLiveFixture = async ( token: string, fixtureId: string, updateData: LiveMatchUpdateRequestBody ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/live-fixtures/update/${ fixtureId }`,
            updateData,
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

export const getLiveFixtureTeamPlayerList = async ( fixtureId: string ) => {
    try {
        const response = await axiosInstance.get(
            `${ API_URL }/live-fixtures/fixtures/${ fixtureId }/players`,
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