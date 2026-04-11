import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Session expired.");
      sessionStorage.removeItem("authToken");
      //   window.location.href = "/auth/login";
    }

    let msg = error.response?.data?.message || error.message;
    if (msg && msg.toLowerCase().includes("status code")) {
      msg = "Something went wrong on the server. Please try again later.";
    } else if (!msg || error.code === "ERR_NETWORK") {
      msg = "Network error. Please check your connection and try again.";
    }

    error.customMessage = msg;
    return Promise.reject(error);
  },
);

export default api;
