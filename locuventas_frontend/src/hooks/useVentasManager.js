import { useState, useEffect, useCallback } from "react";
import { VentaService } from "@/services/venta.service";
import { toast } from "react-toastify";

export default function useVentasManager(initialPage = 0, size = 10) {
  // --- ESTADOS ---
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [ventaDetalle, setVentaDetalle] = useState(null);
  const [detalleCargando, setDetalleCargando] = useState(false);

  const [modalConfirmacion, setModalConfirmacion] = useState({ 
    visible: false, 
    mensaje: "", 
    onConfirmar: null 
  });
  
  const [modalPago, setModalPago] = useState({ 
    visible: false, 
    venta: null, 
    totalPendiente: 0 
  });

  // --- LOGICA DE CARGA ---
  
  // Usamos useCallback para poder llamarla desde otros sitios sin problemas de dependencias
  const fetchVentas = useCallback(async () => {
    setLoading(true);
    try {
      // El backend devuelve PageDTO directamente: { content: [], totalPages: X, ... }
      const data = await VentaService.getAll({ page, size });
      
      setVentas(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      toast.error(error.mensaje || "Error cargando ventas");
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  // --- ACCIONES ---

  const verDetalleVenta = async (venta) => {
    setDetalleCargando(true);
    try {
      const data = await VentaService.getById(venta.id);
      setVentaDetalle(data);
    } catch (error) {
      toast.error("No se pudo cargar el detalle de la venta");
    } finally {
      setDetalleCargando(false);
    }
  };

  const solicitarCancelacion = (ventaId) => {
    setModalConfirmacion({
      visible: true,
      mensaje: "¿Seguro que quieres cancelar esta venta?",
      onConfirmar: async () => {
        try {
          await VentaService.cancelar(ventaId);
          toast.success("Venta cancelada");
          fetchVentas(); // Recargamos la lista
        } catch (error) {
          toast.error(error.mensaje || "No se pudo cancelar la venta");
        } finally {
          setModalConfirmacion(m => ({ ...m, visible: false }));
        }
      },
    });
  };

  const abrirPago = (venta) => {
    setModalPago({
      visible: true,
      venta,
      totalPendiente: venta.saldo ?? (venta.total - (venta.montoPagado || 0)),
    });
  };

  const confirmarPago = async (monto) => {
    if (!modalPago.venta) return;
    try {
      await VentaService.registrarPago(modalPago.venta.id, { monto });
      toast.success("Pago registrado");
      cerrarModalPago();
      fetchVentas();
    } catch (error) {
      toast.error(error.mensaje || "Error registrando el pago");
    }
  };

  const cerrarModalPago = () => {
    setModalPago({ visible: false, venta: null, totalPendiente: 0 });
  };

  const descargarTicket = async (ventaId) => {
    try {
      await VentaService.descargarTicketPDF(ventaId);
      toast.info("Descargando ticket...");
    } catch (error) {
      toast.error("Error al descargar el ticket");
    }
  };

  return {
    // Estado de datos
    ventas, loading, page, totalPages, totalElements, setPage,
    ventaDetalle, setVentaDetalle, detalleCargando,
    
    // Modales y acciones
    modalPago, abrirPago, confirmarPago, cerrarModalPago,
    modalConfirmacion, setModalConfirmacion, solicitarCancelacion,
    verDetalleVenta, descargarTicket,
    
    // Recarga manual
    fetchVentas
  };
}