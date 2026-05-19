export const stripBearerPrefix = (token = "") =>
  String(token).replace(/^Bearer\s+/i, "").trim();

export const decodeJwtPayload = (token = "") => {
  const normalized = stripBearerPrefix(token);
  const parts = normalized.split(".");
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = payloadBase64.padEnd(
      payloadBase64.length + ((4 - (payloadBase64.length % 4)) % 4),
      "=",
    );
    const decodedPayload = atob(paddedPayload);
    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
};

export const getJwtExpiryEpochSeconds = (token = "") => {
  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;
  return Number.isFinite(exp) ? Number(exp) : null;
};

export const hasTokenExpired = (token = "", skewSeconds = 0) => {
  const exp = getJwtExpiryEpochSeconds(token);
  if (!exp) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  return now + Math.max(0, skewSeconds) >= exp;
};

export const clearStoredAuthSession = () => {
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

export const getStoredAuthToken = () => {
  const authToken = sessionStorage.getItem("authToken");
  return stripBearerPrefix(authToken || "");
};

export const setStoredAuthToken = (token = "") => {
  const normalizedToken = stripBearerPrefix(token);
  if (!normalizedToken) {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("token");
    return;
  }

  sessionStorage.setItem("authToken", normalizedToken);
  sessionStorage.removeItem("token");
};
