import api from './backendConnection';

const notificationService = {
  getAll: async () => {
    const response = await api.get('student/notifications/read_all.php');
    return response.data.data || [];
  },

  getUnreadCount: async () => {
    const response = await api.get('student/notifications/unread_count.php');
    return response.data.data?.count || 0;
  },

  markAsRead: async (id) => {
    const response = await api.post(`student/notifications/mark_read.php`, { id });
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.post('student/notifications/mark_all_read.php');
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete('student/notifications/delete.php', { data: { id } });
    return response.data;
  },

  deleteAll: async () => {
    const response = await api.delete('student/notifications/delete_all.php');
    return response.data;
  }
};

export default notificationService;
