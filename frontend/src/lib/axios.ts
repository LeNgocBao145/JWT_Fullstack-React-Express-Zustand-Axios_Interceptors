import useAuthStore from '@/stores/authStore';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
    withCredentials: true,
});

// Set accessToken into request header
api.interceptors.request.use((config) => {
    // Method getState() just get the value when this method is called
    // if there is any change of accessToken variable, it will not 
    // automatically update the value of variable
    const {accessToken} = useAuthStore.getState();
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

export default api;