import api from './backendConnection';

const testimonialService = {
  create: (data) => api.post('testimonial/create.php', data).then(r => r.data),
  getAll: (params = {}) => api.get('admin/testimonials/read_all.php', { params }).then(r => r.data),
  getApproved: () => api.get('testimonial/read_approved.php').then(r => r.data),
  getMyTestimonials: () => api.get('testimonial/my_testimonials.php').then(r => r.data),
  updateStatus: (id, isApproved) => api.patch('admin/testimonials/update_status.php', { id, is_approved: isApproved }).then(r => r.data),
  delete: (id) => api.delete('admin/testimonials/delete.php', { data: { id } }).then(r => r.data),
};

export default testimonialService;
