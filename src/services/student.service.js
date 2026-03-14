import api from './backendConnection';

const studentService = {
    getAll: async () => {
        const response = await api.get('student/read.php');
        return response.data; 
    },

    getById: async (id) => {
        const response = await api.get(`student/read_single.php?id=${id}`);
        return response.data;
    },

    update: async (payload) => {
        const response = await api.put('student/update.php', payload);
        return response.data;
    }
};

export default studentService;