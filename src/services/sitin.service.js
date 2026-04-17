import api from './backendConnection';

const sitinService = {
    // Student endpoints
    timeIn: async (payload) => {
        // payload: { student_id, lab_id, purpose }
        const response = await api.post('student/sitin/time_in.php', payload);
        return response.data;
    },

    timeOut: async (payload) => {
        // payload: { log_id }
        const response = await api.post('student/sitin/time_out.php', payload);
        return response.data;
    },

    endSession: async (logId) => {
        const response = await api.post('student/sitin/end_session.php', { log_id: logId });
        return response.data;
    },

    getHistoryByStudent: async (studentId) => {
        const response = await api.get(`student/sitin/read.php?student_id=${studentId}`);
        return response.data;
    },

    getStats: async (studentId) => {
        const response = await api.get(`student/sitin/stats.php?student_id=${studentId}`);
        return response.data;
    },

    getCurrentSession: async (studentId) => {
        const response = await api.get(`student/sitin/read_single.php?student_id=${studentId}`);
        return response.data;
    },

    submitStudentFeedback: async (payload) => {
        // payload: { sit_in_id, rating, comment }
        const response = await api.post('student/sitin/feedback.php', payload);
        return response.data;
    },

    // Admin endpoints
    create: async (payload) => {
        // payload: { student_id, lab_id, purpose }
        const response = await api.post('admin/sitin/create.php', payload);
        return response.data;
    },

    getActiveSessions: async () => {
        const response = await api.get('admin/sitin/read_active.php');
        return response.data;
    },

    getAllRecords: async (params) => {
        const response = await api.get('admin/sitin/read_all.php', { params });
        return response.data;
    },

    submitFeedback: async (payload) => {
        // payload: { log_id, feedback }
        const apiPayload = {
            sit_in_id: payload.log_id,
            feedback_text: payload.feedback
        };
        const response = await api.post('admin/sitin/feedback.php', apiPayload);
        return response.data;
    },

    endSessionAdmin: async (logId) => {
        const response = await api.post('admin/sitin/end_session.php', { log_id: logId });
        return response.data;
    }
};

export default sitinService;
