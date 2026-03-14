import api from './axiosConfig';

const BASE = '/api/auth';

export const AuthService = {

    // Login
    login: async (credentials) => {
        const response = await api.post(`${BASE}/login`, credentials);

        const res = response.data;

        console.log('[AuthService] Login response:', res);

        // Token may be inside res.data
        const jwt =
            res?.data?.token ||
            res?.data?.accessToken ||
            res?.data?.access_token ||
            res?.data?.jwt ||
            res?.data?.jwtToken ||
            res?.token ||
            res?.accessToken ||
            null;

        if (jwt) {
            localStorage.setItem('token', jwt);
            console.log('[AuthService] Token stored successfully');
        } else {
            console.warn('[AuthService] Token not found in response');
        }

        return res;
    },

    // Validate token
    validateToken: async (token) => {
        const response = await api.post(`${BASE}/validate`, { token });
        return response.data;
    },

    // Health check
    checkHealth: async () => {
        const response = await api.get(`${BASE}/health`);
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
    }
};

export default AuthService;