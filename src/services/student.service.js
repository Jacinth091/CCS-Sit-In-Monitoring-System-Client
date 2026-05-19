import api from "./backendConnection";

const studentService = {
  // Student Profile Endpoints
  getProfile: async () => {
    const response = await api.get("student/profile/read.php");
    return response.data.data;
  },

  updateProfile: async (payload) => {
    const response = await api.put("student/profile/update.php", payload);
    return response.data;
  },

  uploadProfilePicture: async (formData) => {
    const response = await api.post("student/profile/upload_pic.php", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Admin Student Management Endpoints
  adminCreate: async (payload) => {
    const response = await api.post("auth/register.php", payload);
    return response.data;
  },

  adminUpdate: async (payload) => {
    const response = await api.put("admin/student/update.php", payload);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get("admin/student/read.php");
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`admin/student/read_single.php?id=${id}`);
    return response.data.data;
  },

  search: async (query) => {
    const response = await api.get(`admin/student/search.php?query=${query}`);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete("admin/student/delete.php", { data: { id } });
    return response.data;
  },

  resetSessions: async () => {
    const response = await api.post("admin/student/reset_sessions.php");
    return response.data;
  },

  resetSingleSession: async (student_id) => {
    const response = await api.post("admin/student/reset_single_session.php", { student_id });
    return response.data;
  },

  // Deprecated or legacy (if any)
  update: async (payload) => {
    // Keep for backward compatibility if needed, but point to admin update if it exists
    const response = await api.put("admin/student/update.php", payload);
    return response.data;
  },
};

export default studentService;
