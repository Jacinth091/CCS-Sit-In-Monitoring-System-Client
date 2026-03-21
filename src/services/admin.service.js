import api from './backendConnection';

const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('admin/dashboard_stats.php');
    return response.data;
  }
};

export default adminService;
