import api from './backendConnection';

const softwareService = {
  // General
  getAll: (params = {}) => api.get('admin/software/read.php', { params }).then(r => r.data),
  
  // Admin Endpoints
  create: (data) => api.post('admin/software/create.php', data).then(r => r.data),
  update: (data) => api.put('admin/software/update.php', data).then(r => r.data),
  delete: (id) => api.delete('admin/software/delete.php', { data: { id } }).then(r => r.data),
  assignToLab: (labId, softwareId) => api.post('admin/software/assign_to_lab.php', { lab_id: labId, software_id: softwareId }).then(r => r.data),
  
  // Requests (Admin)
  getRequests: (status = null) => {
    let url = 'admin/software/requests.php';
    if (status) url += `?status=${status}`;
    return api.get(url).then(r => r.data);
  },
  markRequestsReviewed: (requestIds) => api.post('admin/software/mark_reviewed.php', { request_ids: requestIds }).then(r => r.data),
  
  // Requests (Student)
  getStudentCatalog: () => api.get('student/software/read.php').then(r => r.data),
  submitRequest: (data) => api.post('student/software/request.php', data).then(r => r.data),
};

export default softwareService;
