import api from './backendConnection';

const analyticsService = {
  getAnalytics: (from, to) => api.get('admin/analytics/trends.php', { params: { from, to } }).then(r => r.data),
  getTrends: (days) => api.get('admin/analytics/trends.php', { params: { days } }).then(r => r.data),
};

export default analyticsService;
