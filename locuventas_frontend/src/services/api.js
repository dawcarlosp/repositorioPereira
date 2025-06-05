const apiUrl = import.meta.env.VITE_API_URL;

export const apiRequest = async (endpoint, data, options = {}) => {
    const { method = "POST", isFormData = false } = options;

    // Intentamos obtener el token del localStorage (o ajusta según tu app)
    const token = JSON.parse(localStorage.getItem("auth"))?.token;

    // Configuración base
    const requestOptions = {
        method,
        headers: {},
        credentials: "include", // Para cookies si aplica
    };

    const isBodyAllowed = method !== "GET" && method !== "HEAD";

    if (isBodyAllowed && data) {
        requestOptions.body = isFormData ? data : JSON.stringify(data);
        if (!isFormData) {
            requestOptions.headers["Content-Type"] = "application/json";
        }
    }

    // Incluir token si existe
    if (token) {
        requestOptions.headers["Authorization"] = `Bearer ${token}`;
    }

    // Si es GET con data, convertir a query params
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
            console.warn("No se pudo parsear como JSON");
        }

        if (!response.ok) {
            throw result;
        }

        return result;
    } catch (error) {
        console.error("Error en la API:", error);
        throw error;
    }
};
