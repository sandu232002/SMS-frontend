import api from './axiosConfig';

const BASE = '/api/auth';

export const AuthService = {
    /**
     * Login to the application.
     * @param {Object} credentials - username and password
     * @returns {Promise<Object>} The JWT and admin metadata
     */
    login: async (credentials) => {
        const response = await api.post(`${BASE}/login`, credentials);
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    /**
     * Validate an existing token.
     * @param {string} token
     * @returns {Promise<Object>}
     */
    validateToken: async (token) => {
        const response = await api.post(`${BASE}/validate`, { token });
        return response.data;
    },

    /**
     * Check auth service health. Does not require auth.
     * @returns {Promise<Object>}
     */
    checkHealth: async () => {
        const response = await api.get(`${BASE}/health`);
        return response.data;
    },

    /**
     * Logout user by clearing token.
     */
    logout: () => {
        localStorage.removeItem('token');
    }
};

export default AuthService;
