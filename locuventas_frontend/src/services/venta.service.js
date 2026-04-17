// src/services/venta.service.js
import { apiRequest } from "./api.config";

/**
 * Servicio para la gestión de ventas.
 * Se comunica con el VentaController del backend.
 */
export const VentaService = {
  
  /**
   * Obtiene la lista de ventas paginada.
   * El backend responde con un PageDTO<VentaResponseDTO>.
   */
  getAll: async ({ page = 0, size = 10 }) => {
    return await apiRequest(`ventas?page=${page}&size=${size}`, null, {
      method: "GET",
    });
  },

  /**
   * Obtiene las ventas con saldo pendiente.
   */
  getVentasPendientes: async ({ page = 0, size = 10 }) => {
    return await apiRequest(`ventas/pendientes?page=${page}&size=${size}`, null, {
      method: "GET",
    });
  },

  /**
   * Obtiene el detalle completo de una venta por ID.
   */
  getById: async (id) => {
    return await apiRequest(`ventas/${id}`, null, {
      method: "GET",
    });
  },

  /**
   * Crea una nueva venta.
   */
  create: async (ventaData) => {
    return await apiRequest("ventas", ventaData, {
      method: "POST",
    });
  },

  /**
   * Registra un pago para una venta existente.
   * @param {number} id - ID de la venta
   * @param {object} data - { monto: number }
   */
  registrarPago: async (id, data) => {
    return await apiRequest(`ventas/${id}/pago`, data, {
      method: "POST",
    });
  },

  /**
   * Cancela una venta (Solo ADMIN en el backend).
   */
  cancelar: async (id) => {
    return await apiRequest(`ventas/${id}/cancelar`, null, {
      method: "PATCH",
    });
  },

  /**
   * Descarga el ticket PDF de la venta.
   * Maneja la respuesta como Blob para permitir la descarga en el navegador.
   */
  descargarTicketPDF: async (ventaId) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
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

      // Intentar obtener el nombre del archivo desde el backend
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `ticket-${ventaId}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) filename = match[1];
      }

      // Crear enlace temporal y disparar descarga
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Limpieza de memoria
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando ticket:", error);
      throw error;
    }
  },
};