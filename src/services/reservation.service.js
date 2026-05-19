import api from './backendConnection';

const reservationService = {
  // Student
  create: (data) => api.post('reservation/create.php', {
    ...data,
    time_slot: data.reserved_time
  }).then(r => r.data),
  
  getMyReservations: () => api.get('reservation/my_reservations.php').then(r => r.data),
  
  cancel: (id) => api.post('reservation/cancel.php', { id }).then(r => r.data),

  studentReschedule: (id, data) => api.post('reservation/reschedule.php', { 
    id, 
    ...data,
    time_slot: data.reserved_time 
  }).then(r => r.data),

  getOccupiedPcs: (labId, date, timeSlot) => 
    api.get('reservation/occupied_pcs.php', { 
      params: { lab_id: labId, date, time_slot: timeSlot } 
    }).then(r => r.data),

  getLabPcs: (labId) =>
    api.get('reservation/lab_pcs.php', {
      params: { lab_id: labId }
    }).then(r => r.data),

  // Admin
  getAll: (filters) => {
    const params = typeof filters === 'string' ? { status: filters } : filters;
    return api.get('admin/reservations/read_all.php', { params }).then(r => r.data);
  },
  
  updateStatus: (id, status, extra = {}) =>
    api.post('admin/reservations/update_status.php', { id, status, ...extra }).then(r => r.data),

  reschedule: (reservationId, payload) =>
    api.post('admin/reservations/reschedule.php', {
      reservation_id: reservationId,
      ...payload,
    }).then(r => r.data),

  getAuditLog: (filters = {}, page = 1, perPage = 20) =>
    api.get('admin/reservations/audit_log.php', {
      params: {
        page,
        per_page: perPage,
        ...filters,
      },
      paramsSerializer: (params) => {
        const search = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') return;
          if (Array.isArray(value)) {
            value.forEach((item) => search.append(`${key}[]`, item));
            return;
          }
          search.append(key, value);
        });
        return search.toString();
      },
    }).then(r => r.data),
  
  getSettings: () => api.get('reservation/settings.php').then(r => r.data),
  
  setSettings: (enabled) => api.post('reservation/settings.php', { enabled }).then(r => r.data),
};

export default reservationService;
