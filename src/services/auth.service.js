import api from "./backendConnection";
import {
  clearStoredAuthSession,
  decodeJwtPayload,
  hasTokenExpired,
  setStoredAuthToken,
  stripBearerPrefix,
} from "../utils/authToken";
import aiService from "./ai.service";

const collectLoginTokenCandidates = (body = {}) => {
  const data = body?.data || {};
  const candidates = [
    data?.access_token,
    data?.token,
    data?.jwt,
    body?.access_token,
    body?.token,
    body?.jwt,
  ]
    .map((value) => stripBearerPrefix(value || ""))
    .filter(Boolean);

  return [...new Set(candidates)];
};

const selectBestLoginToken = (body = {}) => {
  const candidates = collectLoginTokenCandidates(body);
  if (candidates.length === 0) {
    return "";
  }

  const validJwtCandidate = candidates.find((token) => {
    const payload = decodeJwtPayload(token);
    return payload && !hasTokenExpired(token, 10);
  });
  if (validJwtCandidate) {
    return validJwtCandidate;
  }

  const nonExpiredCandidate = candidates.find((token) => !hasTokenExpired(token, 10));
  return nonExpiredCandidate || candidates[0];
};

const authService = {
  login: async (payload) => {
    const response = await api.post("auth/login.php", payload);
    const body = response?.data || {};
    const isSuccess =
      body.status === "success" || body.success === true;

    if (isSuccess) {
      const token = selectBestLoginToken(body);
      const user = body?.data?.user || body?.user;
      if (!token || !user) {
        throw new Error("Login response is missing session data.");
      }
      const normalizedToken = stripBearerPrefix(String(token).trim());
      if (!normalizedToken || hasTokenExpired(normalizedToken, 10)) {
        clearStoredAuthSession();
        throw new Error(
          "The session token returned by the server is invalid or expired. Please sign in again.",
        );
      }

      setStoredAuthToken(normalizedToken);
      return user;
    }

    throw new Error(body.message || "Invalid credentials.");
  },

  register: async (payload) => {
    console.log("payload: ", payload);
    const response = await api.post("auth/register.php", payload);
    return response.data;
  },
  logout: async () => {
    try {
      await api.post("auth/logout.php");
    } catch (err) {
      console.warn("Server logout request failed:", err);
    } finally {
      aiService.clearCache();
      clearStoredAuthSession();
    }
  },
};

export default authService;
