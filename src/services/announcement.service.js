import api from './backendConnection';

const announcementService = {
  // Student endpoints
  getAll: async (page = 1) => {
    const response = await api.get(`student/announcements/read.php?page=${page}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`student/announcements/read_single.php?id=${id}`);
    return response.data.data;
  },

  // Admin endpoints
  getAdminAnnouncements: async (page = 1) => {
    const response = await api.get(`admin/announcements/read.php?page=${page}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post('admin/announcements/create.php', payload);
    return response.data;
  },

  update: async (payload) => {
    const response = await api.post('admin/announcements/update.php', payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.post('admin/announcements/delete.php', { id });
    return response.data;
  }
};

export default announcementService;
