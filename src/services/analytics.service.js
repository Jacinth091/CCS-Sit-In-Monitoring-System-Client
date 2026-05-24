import api from './backendConnection';

const analyticsService = {
  getAnalytics: (from, to) => api.get('admin/analytics/trends.php', { params: { from, to } }).then(r => r.data),
  getTrends: (days) => api.get('admin/analytics/trends.php', { params: { days } }).then(r => r.data),
  
  downloadAnalytics: async (filters, type = 'csv', aiInsights = null) => {
    const response = await api.post('admin/analytics/export.php', 
      { from: filters.from, to: filters.to, type, ai_insights: aiInsights },
      { responseType: 'blob' }
    );
    
    const extension = type === 'pdf' ? 'pdf' : 'csv';
    const mimeType = type === 'pdf' ? 'application/pdf' : 'text/csv';
    
    const blob = response.data instanceof Blob ? response.data : new Blob([response.data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitin_analytics_${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};

export default analyticsService;
