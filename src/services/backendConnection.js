import axios from "axios";
import {
  clearStoredAuthSession,
  getStoredAuthToken,
  hasTokenExpired,
  stripBearerPrefix,
} from "../utils/authToken";

import { API_URL } from "../config";
const configuredApiUrl = String(API_URL || "")
  .trim()
  .replace(/^['"]|['"]$/g, "");
const baseURL = import.meta.env.DEV ? "/api" : (configuredApiUrl || "/api");

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const isAuthEndpoint = (url = "") =>
  /(^|\/)auth\/(login|register)\.php(?:\?|$)/i.test(String(url));

const AUTH_EXPIRED_EVENT = "auth:expired";
let redirectingToLogin = false;

const expireSessionAndRedirect = () => {
  if (!redirectingToLogin) {
    console.error("Session expired or unauthorized.");
  }

  clearStoredAuthSession();
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));

  if (!window.location.pathname.includes("/auth/login") && !redirectingToLogin) {
    redirectingToLogin = true;
    window.location.href = "/auth/login";
  }
};

api.interceptors.request.use((config) => {
  const token = getStoredAuthToken();
  const authRequest = isAuthEndpoint(config.url);
  const normalizedToken = stripBearerPrefix(token || "");

  if (!config.headers) {
    config.headers = {};
  }

  // Handle FormData: Remove Content-Type to let browser set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  if (authRequest || config._retryWithoutAuth) {
    delete config.headers.Authorization;
    delete config.headers["X-Auth-Token"];
    return config;
  }

  if (normalizedToken && hasTokenExpired(normalizedToken, 10)) {
    expireSessionAndRedirect();
    return Promise.reject(
      Object.assign(new Error("Session token expired."), {
        customMessage: "Your session has expired. Please sign in again.",
        code: "AUTH_TOKEN_EXPIRED",
      }),
    );
  }

  if (normalizedToken) {
    config.headers.Authorization = config._retryWithRawToken
      ? normalizedToken
      : `Bearer ${normalizedToken}`;
    config.headers["X-Auth-Token"] = normalizedToken;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authRequest = isAuthEndpoint(error.config?.url);
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !authRequest &&
      originalRequest &&
      !originalRequest._retryWithRawToken
    ) {
      originalRequest._retryWithRawToken = true;
      return api.request(originalRequest);
    }

    if (error.response?.status === 401 && !authRequest) {
      expireSessionAndRedirect();
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
