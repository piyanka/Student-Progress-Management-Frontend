const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

function parseStoredValue(key) {
  const raw = localStorage.getItem(key);
  if (raw == null) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export function getAuthToken() {
  return parseStoredValue("token");
}

export function getAuthHeaders(extraHeaders = {}) {
  const token = getAuthToken();
  return token
    ? { authorization: `Bearer ${token}`, ...extraHeaders }
    : { ...extraHeaders };
}

export function buildApiUrl(path) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiRequest(path, { method = "GET", body, headers = {}, auth = true } = {}) {
  const requestHeaders = { ...headers };

  if (auth) {
    Object.assign(requestHeaders, getAuthHeaders());
  }

  const init = { method, headers: requestHeaders };

  if (body !== undefined) {
    init.headers = { "Content-Type": "application/json", ...init.headers };
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetch(buildApiUrl(path), init);
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message = typeof data === "string"
      ? data
      : data?.error || data?.result || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}
