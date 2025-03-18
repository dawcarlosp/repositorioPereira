const apiUrl = import.meta.env.VITE_API_URL;

export const apiRequest = async (endpoint, data) => {
    try {
        const response = await fetch(`${apiUrl}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Error en la solicitud");

        return result; // Devuelve la respuesta en caso de éxito
    } catch (error) {
        console.error("Error en la API:", error.message);
        throw error; // Lanza el error para manejarlo en cada formulario
    }
};
