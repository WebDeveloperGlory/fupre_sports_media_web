import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

export default axiosInstance;