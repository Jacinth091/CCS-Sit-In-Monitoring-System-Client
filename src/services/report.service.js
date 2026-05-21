import api from './backendConnection';

const reportService = {
  generate: (filters, page = 1, limit = 20) => api.get('admin/reports/generate.php', { params: { ...filters, page, limit } }).then(r => r.data),
  
  downloadReport: async (filters, type = 'csv') => {
    const response = await api.get('admin/reports/generate.php', {
      params: { ...filters, type },
      responseType: 'blob',
    });
    
    const contentType = response.headers['content-type'] || '';
    const extension = type === 'pdf' ? 'pdf' : 'csv';
    const mimeType = type === 'pdf' ? 'application/pdf' : 'text/csv';
    
    const blob = new Blob([response.data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitin_report_${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};

export default reportService;
