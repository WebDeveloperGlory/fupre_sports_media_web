import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_NEW_PROD_API_URL : process.env.NEXT_PUBLIC_NEW_DEV_API_URL;

const newAxiosFormInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    withCredentials: true
});

// Retry failed requests up to 3 times with exponential backoff
newAxiosFormInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const { config, response } = error;

        const isRenderColdStart =
            !response ||
            [502, 503, 504].includes(response.status);

        const shouldRetry =
            config &&
            isRenderColdStart &&
            (!config._retryCount || config._retryCount < 3);

        if (!shouldRetry) {
            return Promise.reject(error);
        }

        config._retryCount = (config._retryCount || 0) + 1;

        // Backoff: 1s → 2s → 4s (enough for Render to wake up)
        const delay = Math.pow(2, config._retryCount - 1) * 1000;

        console.warn(
            `Render cold start detected. Retry ${config._retryCount}/3 in ${delay}ms`
        );

        await new Promise(res => setTimeout(res, delay));
        return newAxiosFormInstance(config);
    }
);

export default newAxiosFormInstance;