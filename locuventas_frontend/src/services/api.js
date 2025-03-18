const apiUrl = import.meta.env.VITE_API_URL;

export const apiRequest = async (endpoint, data, options = {}) => {
    const { method = "POST", isFormData = false } = options;

    // Ajustar las opciones dependiendo de si es FormData o JSON
    const requestOptions = {
        method,
        body: isFormData ? data : JSON.stringify(data), // Si es FormData, pasa directamente, si no, stringify el JSON
        headers: isFormData 
            ? {} // No necesita Content-Type para FormData
            : { "Content-Type": "application/json" }, // Si es JSON, setea el Content-Type como application/json
    };

    try {
        // Realiza la solicitud con los ajustes configurados
        const response = await fetch(`${apiUrl}/${endpoint}`, requestOptions);
        const text = await response.text();

        let result = {};
        try {
            if (text) result = JSON.parse(text);
        } catch (parseError) {
            result = { message: text }; // Si no se puede parsear, devuelve el mensaje directamente
            console.warn("No se pudo parsear como JSON:", parseError);
        }

        // Si la respuesta no es correcta, lanzar error
        if (!response.ok) {
            throw new Error(result.error || result.message || "Error en la solicitud");
        }

        return result; // Devuelve el resultado exitoso
    } catch (error) {
        console.error("Error en la API:", error.message); // Error de solicitud
        throw error; // Lanza el error
    }
};
