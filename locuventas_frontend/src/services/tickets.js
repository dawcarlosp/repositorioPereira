// Puedes mover esto a un archivo api/tickets.js si prefieres modularidad.
export async function descargarTicketPDF(ventaId) {
  try {
    const token = JSON.parse(localStorage.getItem("auth"))?.token;
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/ventas/${ventaId}/ticket-pdf`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw new Error("Error al descargar el ticket");

    // Crear un enlace "virtual" para descargar el archivo PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Forzar la descarga
    const a = document.createElement("a");
    a.href = url;
    a.download = `ticket-venta-${ventaId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert(error.message || "No se pudo descargar el ticket.");
  }
}
