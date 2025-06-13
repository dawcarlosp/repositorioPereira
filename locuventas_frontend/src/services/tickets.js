// src/api/tickets.js
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

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    //  Obtener el nombre correcto desde el header
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = `ticket-venta-${ventaId}.pdf`;

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match?.[1]) {
        filename = match[1];
      }
    }

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert(error.message || "No se pudo descargar el ticket.");
  }
}
