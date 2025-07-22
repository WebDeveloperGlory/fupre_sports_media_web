import axiosInstance from "@/lib/config/axiosInstance";
import { CreateBlogForm } from "@/utils/V2Utils/formData";

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

export const getAllBlogs = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/blog`);
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
            console.error('Error fetching all blogs: ', err );
            return null;
        }
    }
};

export const getBlogByID = async ( blogId: string ) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/blog/${blogId}`);
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
            console.error('Error fetching blog by ID: ', err );
            return null;
        }
    }
};

export const createBlog = async ( formData: CreateBlogForm ) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/blog`,
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
            console.error('Error creating blog: ', err );
            return null;
        }
    }
};

export const editBlog = async ( blogId: string, formData: CreateBlogForm ) => {
    try {
        const response = await axiosInstance.put(
            `${API_URL}/blog/${blogId}`,
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
            console.error('Error editing blog: ', err );
            return null;
        }
    }
};

export const deleteBlog = async ( blogId: string ) => {
    try {
        const response = await axiosInstance.delete(
            `${API_URL}/blog/${blogId}`,
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
            console.error('Error deleting blog: ', err );
            return null;
        }
    }
};

export const publishBlog = async ( blogId: string ) => {
    try {
        const response = await axiosInstance.put(
            `${API_URL}/blog/${blogId}/publish`,
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
            console.error('Error deleting blog: ', err );
            return null;
        }
    }
};