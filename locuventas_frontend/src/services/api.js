// src/services/api.js

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const apiRequest = async (endpoint, data, options = {}) => {
  const { method = "POST", isFormData = false } = options;
  const token = JSON.parse(localStorage.getItem("auth"))?.token;

  const requestOptions = {
    method,
    headers: {},
    credentials: "include",
  };

  // Añade Authorization si el token existe y no es login/register
  if (
    token &&
    !endpoint.includes("auth/login") &&
    !endpoint.includes("auth/register")
  ) {
    requestOptions.headers["Authorization"] = `Bearer ${token}`;
  }

  // Solo métodos que permiten body
  const isBodyAllowed = method !== "GET" && method !== "HEAD";
  if (isBodyAllowed && data) {
    if (isFormData) {
      requestOptions.body = data;
      // No ponemos Content-Type, FormData lo hace solo
    } else {
      requestOptions.body = JSON.stringify(data);
      requestOptions.headers["Content-Type"] = "application/json";
    }
  }

  // Monta la URL final (GET con query string)
  let fullUrl = `${apiUrl}/${endpoint}`;
  if (method === "GET" && data) {
    const queryParams = new URLSearchParams(data).toString();
    fullUrl += `?${queryParams}`;
  }

  // Haz la petición
  const response = await fetch(fullUrl, requestOptions);

  // Siempre intenta leer como texto (por si el backend responde vacío)
  const text = await response.text();
  let result;
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = text || {};
  }

  // Si NO ok (error HTTP), lanza el error parseado para el catch
  if (!response.ok) throw result;
  return result;
};
