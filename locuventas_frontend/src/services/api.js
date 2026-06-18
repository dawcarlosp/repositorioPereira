import { API_BASE_URL } from "@/app/config/api";

const getAuthData = () => {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(localStorage.getItem("auth") || "null");
  } catch {
    return null;
  }
};

export const apiRequest = async (endpoint, data, options = {}) => {
  const { method = "POST", isFormData = false } = options;
  const token = getAuthData()?.token;

  const requestOptions = {
    method,
    headers: {},
    credentials: "include",
  };

  if (
    token &&
    !endpoint.includes("auth/login") &&
    !endpoint.includes("auth/register")
  ) {
    requestOptions.headers["Authorization"] = `Bearer ${token}`;
  }

  const isBodyAllowed = method !== "GET" && method !== "HEAD";
  if (isBodyAllowed && data !== undefined && data !== null) {
    if (isFormData) {
      requestOptions.body = data;
    } else {
      requestOptions.body = JSON.stringify(data);
      requestOptions.headers["Content-Type"] = "application/json";
    }
  }

  const normalizedEndpoint = endpoint.replace(/^\/+/, "");
  let fullUrl = `${API_BASE_URL.replace(/\/+$/, "")}/${normalizedEndpoint}`;

  if (method === "GET" && data && typeof data === "object") {
    const queryParams = new URLSearchParams(data).toString();
    if (queryParams) {
      fullUrl += `?${queryParams}`;
    }
  }

  const response = await fetch(fullUrl, requestOptions);
  const text = await response.text();

  let result;
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = text || {};
  }

  if (!response.ok) {
    throw result;
  }

  return result;
};
