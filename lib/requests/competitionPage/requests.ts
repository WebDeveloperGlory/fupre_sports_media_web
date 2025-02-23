import axiosInstance from "@/lib/config/axiosInstance";
import { mockInterLevelCompetition } from "@/constants";

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

        // Add the mock Inter Level competition to the list
        if (data.code === '00' && Array.isArray(data.data)) {
            data.data.unshift(mockInterLevelCompetition);
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
        // Return mock Inter Level competition if ID matches
        if (id === mockInterLevelCompetition._id) {
            return {
                code: '00',
                message: 'Success',
                data: mockInterLevelCompetition
            };
        }

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
        // Return mock Inter Level competition overview if ID matches
        if (id === mockInterLevelCompetition._id) {
            return {
                code: '00',
                message: 'Success',
                data: mockInterLevelCompetition.overview
            };
        }

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
        // Return empty array for knockout competitions
        if (id === mockInterLevelCompetition._id) {
            return {
                code: '00',
                message: 'Success',
                data: []
            };
        }

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

export const getKnockoutRounds = async ( id: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/competition/${ id }/knockout/phases` );
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
        // Return mock Inter Level competition top players if ID matches
        if (id === mockInterLevelCompetition._id) {
            return {
                code: '00',
                message: 'Success',
                data: mockInterLevelCompetition.overview.topScorers
            };
        }

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
        // Return empty array for knockout competitions
        if (id === mockInterLevelCompetition._id) {
            return {
                code: '00',
                message: 'Success',
                data: []
            };
        }

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
        // Return empty array for knockout competitions
        if (id === mockInterLevelCompetition._id) {
            return {
                code: '00',
                message: 'Success',
                data: []
            };
        }

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
        // Return empty array for knockout competitions
        if (id === mockInterLevelCompetition._id) {
            return {
                code: '00',
                message: 'Success',
                data: []
            };
        }

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
        // Return mock Inter Level competition fixtures if ID matches
        if (id === mockInterLevelCompetition._id) {
            const fixtures = mockInterLevelCompetition.knockoutRounds.reduce((acc: any[], round) => {
                return [...acc, ...round.fixtures];
            }, []);

            return {
                code: '00',
                message: 'Success',
                data: {
                    upcomingMatches: fixtures.filter(f => f.status === 'upcoming'),
                    completedMatches: fixtures.filter(f => f.status === 'completed')
                }
            };
        }

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