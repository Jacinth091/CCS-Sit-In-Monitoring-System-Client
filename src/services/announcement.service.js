import api from './backendConnection';

const announcementService = {
  getAll: async () => {
    const response = await api.get('announcements/read.php');
    return response.data.data || [];
  },

  create: async (payload) => {
    const response = await api.post('announcements/create.php', payload);
    return response.data;
  }
};

export default announcementService;
