const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const apiRequest = async (endpoint, data, options = {}) => {
  const { method = "POST", isFormData = false } = options;
  const token = JSON.parse(localStorage.getItem("auth"))?.token;

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
  if (isBodyAllowed && data) {
    if (isFormData) {
      requestOptions.body = data;
      // NO Content-Type, FormData lo maneja el navegador
    } else {
      requestOptions.body = JSON.stringify(data);
      requestOptions.headers["Content-Type"] = "application/json";
    }
  }

  // GET: añade params como query, no como body
  let fullUrl = `${apiUrl}/${endpoint}`;
  if (method === "GET" && data) {
    const queryParams = new URLSearchParams(data).toString();
    fullUrl += `?${queryParams}`;
  }

  try {
    const response = await fetch(fullUrl, requestOptions);
    const text = await response.text();
    let result;
    try {
      result = text ? JSON.parse(text) : {};
    } catch {
      result = text || {};
    }
    if (!response.ok) throw result;
    return result;
  } catch (error) {
    throw error;
  }
};
