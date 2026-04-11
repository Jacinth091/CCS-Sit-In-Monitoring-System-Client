import api from "./backendConnection";

const authService = {
  login: async (payload) => {
    const response = await api.post("auth/login.php", payload);
    if (response.data.status === "success") {
      const { token, user } = response.data.data;
      sessionStorage.setItem("authToken", token);
      return user;
    }
    return response.data;
  },

  register: async (payload) => {
    console.log("payload: ", payload);
    const response = await api.post("auth/register.php", payload);
    return response.data;
  },
  logout: () => {
    sessionStorage.removeItem("authToken");
  },
};

export default authService;
