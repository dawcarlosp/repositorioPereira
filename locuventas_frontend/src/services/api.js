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
            result = text ? JSON.parse(text) : {}; // Intenta parsear JSON, si no, devuelve texto
        } catch {
            result = text || {}; // Si el texto no es JSON, usa el texto crudo
            console.warn("No se pudo parsear como JSON");
        }

        if (!response.ok) {
            throw new Error(result.error || result.message || "Error en la solicitud");
        }

        return result;
    } catch (error) {
        console.error("Error en la API:", error.message);
        throw error;
    }
};
