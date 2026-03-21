import api from './backendConnection';

const announcementService = {
  getAll: async () => {
    const response = await api.get('announcement/read.php');
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post('announcement/create.php', payload);
    return response.data;
  }
};

export default announcementService;
