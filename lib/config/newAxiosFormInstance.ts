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
    response => response, // Return response if successful
    async error => {
        const { config, response } = error;
        
        // Only retry if:
        // 1. We have a config object
        // 2. We haven't exceeded retry count
        // 3. It's a network error OR a 5xx server error OR a 429 (too many requests)
        const shouldRetry = 
            config && 
            (!config._retryCount || config._retryCount < 3) && 
            (
                !response || // Network error (no response)
                response.status === 429 || // Too many requests
                (response.status >= 500 && response.status <= 599) // Server errors
            );
            
        if (!shouldRetry) {
            return Promise.reject(error);
        }

        config._retryCount = (config._retryCount || 0) + 1;

        // Exponential backoff delay (e.g., 1s, 2s, 4s)
        console.log(`Retry attempt ${config._retryCount}/3...`);
        const delay = Math.pow(2, config._retryCount) * 1000;
        await new Promise(res => setTimeout(res, delay));

        return newAxiosFormInstance(config);
    }
);

export default newAxiosFormInstance;