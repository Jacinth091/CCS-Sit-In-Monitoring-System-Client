import api from './backendConnection';

const sitinService = {
    create: async (payload) => {
        // payload: { student_id, lab_id, purpose }
        const response = await api.post('sitin/create.php', payload);
        return response.data;
    },

    getHistoryByStudent: async (studentId) => {
        const response = await api.get(`sitin/read_by_student.php?student_id=${studentId}`);
        return response.data;
    },

    getActiveSessions: async () => {
        const response = await api.get('sitin/read_active.php');
        return response.data;
    },

    endSession: async (logId) => {
        const response = await api.post('sitin/end_session.php', { log_id: logId });
        return response.data;
    },

    getAllRecords: async () => {
        const response = await api.get('sitin/read.php');
        return response.data.data || [];
    }
};

export default sitinService;
