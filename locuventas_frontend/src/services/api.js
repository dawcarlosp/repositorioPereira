const apiUrl = import.meta.env.VITE_API_URL;

export const apiRequest = async (endpoint, data, options = {}) => {
    const { method = "POST", isFormData = false } = options;

    const requestOptions = {
        method,
        body: isFormData ? data : JSON.stringify(data),
        headers: isFormData ? {} : { "Content-Type": "application/json" },
        credentials: "include", // Permite el uso de cookies si la API lo requiere
    };

    try {
        const response = await fetch(`${apiUrl}/${endpoint}`, requestOptions);
        const text = await response.text();

        let result;
        try {
            result = text ? JSON.parse(text) : {}; // Intenta parsear JSON
        } catch {
            result = text || {}; // Si no es JSON válido, usa el texto crudo
            console.warn("No se pudo parsear como JSON");
        }

        if (!response.ok) {
            throw result; // Lanza el objeto completo de error para manejarlo después
        }

        return result;
    } catch (error) {
        console.error("Error en la API:", error);
        throw error;
    }
};
