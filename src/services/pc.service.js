import api from './backendConnection';

const pcService = {
  getPcsByLab: (labId) =>
    api.get('admin/pcs/read_by_lab.php', {
      params: { lab_id: labId },
    }).then((r) => r.data),

  create: (data) =>
    api.post('admin/pcs/create.php', data).then((r) => r.data),

  delete: (id) =>
    api.delete('admin/pcs/delete.php', { data: { id } }).then((r) => r.data),

  updatePcStatus: (pcId, status) =>
    api.post('admin/pcs/update_status.php', {
      pc_id: pcId,
      status,
    }).then((r) => r.data),

  updateReservationStatus: (pcId, reservationStatus) =>
    api.post('admin/pcs/update_reservation_status.php', {
      pc_id: pcId,
      reservation_status: reservationStatus,
    }).then((r) => r.data),
};

export default pcService;
