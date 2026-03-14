import api from './backendConnection';

const authService = {
    login: async (payload) => {
        const response = await api.post('auth/login.php', payload);
        return response.data;
    },

    register: async (payload) => {
        const response = await api.post('auth/register.php', payload);
        return response.data;
    },
};

export default authService;