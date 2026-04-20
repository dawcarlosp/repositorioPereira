import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@services/api.config";
import { toast } from "react-toastify";

export default function useVentasManager(tipo = "todas", pageInitial = 0) {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(pageInitial);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(6);
  const [modalPago, setModalPago] = useState({
    visible: false,
    totalPendiente: 0,
    venta: null,
  });
  const [modalConfirmacion, setModalConfirmacion] = useState({
    visible: false,
    mensaje: "",
    onConfirmar: null,
  });
  const [ventaDetalle, setVentaDetalle] = useState(null);
  const [detalleCargando, setDetalleCargando] = useState(false);

  const fetchVentas = useCallback(
    async (p = page, s = size) => {
      setLoading(true);
      let datos;
      try {
        if (tipo === "pendientes") {
          datos = await apiRequest(
            `ventas/pendientes?page=${p}&size=${s}`,
            null,
            {
              method: "GET",
            },
          );
        } else {
          datos = await apiRequest(`ventas?page=${p}&size=${s}`, null, {
            method: "GET",
          });
        }
        let listaVentas = datos.content || [];

        setVentas(listaVentas);
        setTotalPages(datos.totalPages || 0);
        setPage(datos.pageNumber || 0);
      } catch {
        toast.error("Error al obtener las ventas");
      } finally {
        setLoading(false);
      }
    },
    [page, tipo, size],
  );

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  useEffect(() => {
    setPage(0);
  }, [size]);

  // --- Funciones de acción (se mantienen igual que antes) ---
  const verDetalleVenta = async (venta) => {
    setDetalleCargando(true);
    try {
      const data = await apiRequest(`ventas/${venta.id}`, null, {
        method: "GET",
      });
      setVentaDetalle(data);
    } catch {
      toast.error("Error al cargar detalle");
    } finally {
      setDetalleCargando(false);
    }
  };

  const abrirPago = (venta) => {
    setModalPago({ visible: true, totalPendiente: venta.saldo, venta });
  };

  const cerrarModalPago = () =>
    setModalPago({ visible: false, totalPendiente: 0, venta: null });

  const confirmarPago = async (importe) => {
    if (!modalPago.venta) return;
    try {
      await apiRequest(
        `ventas/${modalPago.venta.id}/pago`,
        { monto: importe },
        { method: "POST" },
      );
      toast.success("Pago registrado");
      cerrarModalPago();
      fetchVentas();
    } catch {
      toast.error("Error en el pago");
    }
  };

  const solicitarCancelacion = (ventaId) => {
    setModalConfirmacion({
      visible: true,
      mensaje: "¿Seguro que quieres cancelar esta venta?",
      onConfirmar: async () => {
        try {
          await apiRequest(`ventas/${ventaId}/cancelar`, null, {
            method: "PATCH",
          });
          toast.success("Venta cancelada");
          setModalConfirmacion({ visible: false });
          fetchVentas();
        } catch {
          toast.error("Error al cancelar");
        }
      },
    });
  };

  return {
    ventas,
    loading,
    page,
    totalPages,
    setPage,
    size,
    setSize,
    modalPago,
    abrirPago,
    confirmarPago,
    cerrarModalPago,
    modalConfirmacion,
    setModalConfirmacion,
    solicitarCancelacion,
    verDetalleVenta,
    ventaDetalle,
    setVentaDetalle,
    detalleCargando,
  };
}
