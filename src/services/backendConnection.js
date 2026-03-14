import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Optional: GLOBAL REQUEST INTERCEPTOR
// This automatically adds your token if you have one stored in localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Optional: GLOBAL RESPONSE INTERCEPTOR
// This catches errors like 401 (Session Expired) globally
api.interceptors.response.use(
    (response) => response, 
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login or clear local storage
            console.error("Session expired.");
        }
        return Promise.reject(error);
    }
);

export default api;