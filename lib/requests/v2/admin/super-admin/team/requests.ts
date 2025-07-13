import axiosInstance from "@/lib/config/axiosInstance";
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

export const getAllFaculties = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/deptnfac/faculty`);
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
            console.error('Error fetching faculties: ', err );
            return null;
        }
    }
};

export const getAllDepartments = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/deptnfac/department`);
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

export const getAllTeams = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/teams?limit=${100}`);
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

export const createFaculty = async ( name: string ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/deptnfac/faculty`, 
            { name },
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

export const createDepartment = async ( name: string, faculty: string ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/deptnfac/department`, 
            { name, faculty },
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

export const editFaculty = async ( facultyId: string, name: string ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/deptnfac/faculty/${ facultyId }`, 
            { name },
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

export const editDepartment = async ( departmentId: string, name: string, faculty: string ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/deptnfac/department/${ departmentId }`, 
            { name, faculty },
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

export const deleteFaculty = async ( facultyId: string ) => {
    try {
        const response = await axiosInstance.delete(
            `${ API_URL }/deptnfac/faculty/${ facultyId }`, 
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

export const deleteDepartment = async ( departmentId: string ) => {
    try {
        const response = await axiosInstance.delete(
            `${ API_URL }/deptnfac/department/${ departmentId }`, 
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

export const deleteTeam = async ( teamId: string ) => {
    try {
        const response = await axiosInstance.delete(
            `${API_URL}/teams/${teamId}/delete`,
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
            console.error('Error deleting teams: ', err );
            return null;
        }
    }
};

type NewTeamFormData = {
    name: string;
    shorthand: string;
    type: TeamTypes;
    academicYear: string;
    department: string;
    faculty: string;
}
export const createTeam = async ( formData: NewTeamFormData ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/teams`, 
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
            console.error('Team Creation Error: ', err );
            return null;
        }
    }
}

export const getTeamById = async ( teamId: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/teams/${ teamId }` );
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
            console.error('Team Creation Error: ', err );
            return null;
        }
    }
}

export const getTeamPlayers = async ( teamId: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/teams/${ teamId }/players` );
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
            console.error('Team Creation Error: ', err );
            return null;
        }
    }
}

export const getTeamStats = async ( teamId: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/teams/${ teamId }/stats` );
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
            console.error('Team Creation Error: ', err );
            return null;
        }
    }
}

export const getTeamCompsAndPerformance = async ( teamId: string, season: string ) => {
    try {
        const response = await axiosInstance.get( `${ API_URL }/teams/${ teamId }/competition?season=${ season }` );
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
            console.error('Team Creation Error: ', err );
            return null;
        }
    }
}

type TeamBasicInfo = {
    name: string;
    shorthand: string;
    academicYear: string;
    color: {
        primary: string;
        secondary: string;
    }
}
export const updateTeamBasicInfo = async ( teamId: string, formData: TeamBasicInfo ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/teams/${ teamId }/update/info`, 
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
            console.error('Team Creation Error: ', err );
            return null;
        }
    }
}

export const updateTeamCoaches = async ( teamId: string, name: string, role: string ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/teams/${ teamId }/update/coaches`, 
            { name, role },
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
            console.error('Team Creation Error: ', err );
            return null;
        }
    }
}

export const updateTeamAdmin = async ( teamId: string, adminId: string ) => {
    try {
        const response = await axiosInstance.put(
            `${ API_URL }/teams/${ teamId }/update/admin`, 
            { adminId },
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
            console.error('Team Creation Error: ', err );
            return null;
        }
    }
}