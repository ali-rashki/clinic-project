import API from './api';

export const authService = {
    login: async (username, password) => {
        try {
            const response = await API.post('/accounts/login/', {
                username,
                password,
            });
            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    register: async (userData) => {
        try {
            const response = await API.post('/accounts/register/', userData);
            if (response.data.tokens?.access) {
                localStorage.setItem('access_token', response.data.tokens.access);
                localStorage.setItem('refresh_token', response.data.tokens.refresh);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        try {
            const response = await API.get('/accounts/profile/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    isAuthenticated: () => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('access_token');
        }
        return false;
    },
};