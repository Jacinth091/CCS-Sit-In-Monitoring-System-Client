import api from './backendConnection';
import studentService from './student.service';

const normalizeNotification = (n) => {
  // Map type sit_in to session for UI consistency
  let type = n.type || 'system';
  if (type === 'sit_in') type = 'session';
  
  return {
    id: n.id || n.notification_id || n.log_id,
    type: type,
    message: n.message || n.content || n.text || '',
    time: n.time || (n.created_at ? new Date(n.created_at).toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    }) : 'Just now'),
    isUnread: n.isUnread !== undefined ? n.isUnread : (n.is_read !== undefined ? !n.is_read : (n.status === 'unread' || n.status === 0 || n.is_unread === 1))
  };
};

const notificationService = {
  getAll: async () => {
    const response = await api.get('student/notifications/read_all.php');
    const data = response.data.data || [];
    return Array.isArray(data) ? data.map(normalizeNotification) : [];
  },

  getUnreadCount: async () => {
    const response = await api.get('student/notifications/unread_count.php');
    return response.data.data?.count || 0;
  },

  markAsRead: async (id) => {
    // Send in both query and body to be extremely robust against different PHP backend setups
    const response = await api.post(`student/notifications/mark_read.php?id=${id}`, { 
      id: id,
      notification_id: id 
    });
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.post('student/notifications/mark_all_read.php');
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`student/notifications/delete.php?id=${id}`, { 
      data: { 
        id: id,
        notification_id: id
      } 
    });
    return response.data;
  },

  deleteAll: async () => {
    const response = await api.delete('student/notifications/delete_all.php');
    return response.data;
  },

  create: async (payload) => {
    // payload: { student_id, type, message }
    const response = await api.post('student/notifications/create.php', payload);
    return response.data;
  },

  notifyAllStudents: async (type, message) => {
    try {
      const students = await studentService.getAll();
      if (!Array.isArray(students)) return;
      
      const notifications = students.map(s => 
        api.post('student/notifications/create.php', {
          student_id: s.student_id,
          type,
          message
        })
      );
      
      await Promise.allSettled(notifications);
    } catch (err) {
      console.error("Failed to notify all students:", err);
    }
  }
};

export default notificationService;
