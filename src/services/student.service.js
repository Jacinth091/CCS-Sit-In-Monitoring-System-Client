import api from "./backendConnection";

const studentService = {
  getAll: async () => {
    const response = await api.get("student/read.php");
    return response.data.data; // { status, message, data: [...] }
  },

  getById: async (id) => {
    const response = await api.get(`student/read_single.php?id=${id}`);
    console.log("Response: ", response);
    return response.data.data;
  },

  create: async (payload) => {
    // Registers a student via auth/register.php
    const response = await api.post("auth/register.php", payload);
    return response.data;
  },

  update: async (payload) => {
    const response = await api.put("student/update.php", payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete("student/delete.php", { data: { id } });
    return response.data;
  },

  resetSessions: async () => {
    const response = await api.post("student/reset_sessions.php");
    return response.data;
  },

  uploadProfilePicture: async (formData) => {
    const response = await api.post("student/upload_profile.php", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default studentService;
