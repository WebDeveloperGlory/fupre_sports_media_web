import axiosInstance from "@/lib/config/axiosInstance";
import { UserRole } from "@/utils/V2Utils/v2requestData.enums";

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

export const registerUser = async ( name: string, email: string, password: string ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/auth/signup/user`, 
            { name, email, password },
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

export const registerAdmin = async ( name: string, email: string, password: string, role: UserRole ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/auth/signup/admin`, 
            { name, email, password, role },
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

export const loginUser = async ( email: string, password: string ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/auth/login`, 
            { email, password },
            { withCredentials: true }
        );
        const { data }: { data: SuccessRequest } = response;

        if( data.code === '99' ) {
            throw data
        }
        return data;
    } catch( err: any ) {
        const { response } = err as CustomError;
        console.log( err, response );

        if( err?.status && err?.message ) {
            console.error( `Error ${ err.status }: `, response?.data.message )
            return response?.data || null;
        } else {
            console.error('Error fetching fixtures: ', err );
            return null;
        }
    }
}

export const logoutUser = async ( token: string ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/auth/logout`,
            {},
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

export const generateOtp = async ( email: string ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/auth/otp/request`, 
            { email },
            { withCredentials: true }
        );
        const { data }: { data: SuccessRequest } = response;

        if( data.code === '99' ) {
            throw data
        }
        return data;
    } catch( err: any ) {
        const { response } = err as CustomError;
        console.log( err, response );

        if( err?.status && err?.message ) {
            console.error( `Error ${ err.status }: `, response?.data.message )
            return response?.data || null;
        } else {
            console.error('Error generating otp: ', err );
            return null;
        }
    }
}

export const validateOtp = async ( email: string, otp: string ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/auth/otp/verify`, 
            { email, otp },
            { withCredentials: true }
        );
        const { data }: { data: SuccessRequest } = response;

        if( data.code === '99' ) {
            throw data
        }
        return data;
    } catch( err: any ) {
        const { response } = err as CustomError;
        console.log( err, response );

        if( err?.status && err?.message ) {
            console.error( `Error ${ err.status }: `, response?.data.message )
            return response?.data || null;
        } else {
            console.error('Error generating otp: ', err );
            return null;
        }
    }
}

export const resetPassword = async ( email: string, newPassword: string, confirmNewPassword: string ) => {
    try {
        const response = await axiosInstance.post(
            `${ API_URL }/auth/password/reset`, 
            { email, newPassword, confirmNewPassword },
            { withCredentials: true }
        );
        const { data }: { data: SuccessRequest } = response;

        if( data.code === '99' ) {
            throw data
        }
        return data;
    } catch( err: any ) {
        const { response } = err as CustomError;
        console.log( err, response );

        if( err?.status && err?.message ) {
            console.error( `Error ${ err.status }: `, response?.data.message )
            return response?.data || null;
        } else {
            console.error('Error generating otp: ', err );
            return null;
        }
    }
}

export const checkSuperAdminStatus = async () => {
    try {
        const response = await axiosInstance.get(
            `${ API_URL }/auth/check/super-admin`, 
            { withCredentials: true }
        );
        const { data }: { data: SuccessRequest } = response;

        if( data.code === '99' ) {
            throw data
        }
        return data;
    } catch( err: any ) {
        const { response } = err as CustomError;
        console.log( err, response );

        if( err?.status && err?.message ) {
            console.error( `Error ${ err.status }: `, response?.data.message )
            return response?.data || null;
        } else {
            console.error('Error generating otp: ', err );
            return null;
        }
    }
}