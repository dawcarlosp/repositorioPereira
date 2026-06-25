export const VentaService = {
  descargarTicketPDF: async (ventaId: number): Promise<void> => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth") ?? "{}") as { token?: string };
      const token = authData?.token;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ventas/${ventaId}/ticket-pdf`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("No se pudo generar el PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `ticket-${ventaId}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) filename = match[1];
      }

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando ticket:", error);
      throw error;
    }
  },
};
