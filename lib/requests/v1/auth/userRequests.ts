import axiosInstance from "@/lib/config/axiosInstance";

const API_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_PROD_API_URL 
  : process.env.NEXT_PUBLIC_DEV_API_URL;

export const signupUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/auth/signup`,
      userData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const getUserProfile = async (token: string) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/user/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const updateUserProfile = async (token: string, profileData: any) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}/user/profile`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};