import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Retry failed requests up to 3 times with exponential backoff
axiosInstance.interceptors.response.use(
    response => response, // Return response if successful
    async error => {
        const { config } = error;

        if (!config || config._retryCount >= 3) {
            return Promise.reject(error);
        }

        config._retryCount = (config._retryCount || 0) + 1;

        // Exponential backoff delay (e.g., 1s, 2s, 4s)
        console.log('Retrying...')
        const delay = Math.pow(2, config._retryCount) * 1000;
        await new Promise(res => setTimeout(res, delay));

        return axiosInstance( config );
    }
);

export default axiosInstance;