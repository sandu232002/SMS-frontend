import axios from 'axios';

// Single Axios instance routing all requests through the API Gateway
const api = axios.create({
    baseURL: 'http://localhost:8080',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
