import { useState, useEffect } from "react";
import { apiRequest } from "@services/api";
import { toast } from "react-toastify";

export default function useVentasManager(initialPage = 0, size = 10) {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const [ventaDetalle, setVentaDetalle] = useState(null);
  const [detalleCargando, setDetalleCargando] = useState(false);

  const [modalConfirmacion, setModalConfirmacion] = useState({
    visible: false,
    mensaje: "",
    onConfirmar: null,
  });

  const [modalPago, setModalPago] = useState({
    visible: false,
    venta: null,
    totalPendiente: 0,
  });

  useEffect(() => {
    fetchVentas(page, size);
    // eslint-disable-next-line
  }, [page]);

  async function fetchVentas(p = page, s = size) {
    setLoading(true);
    try {
      const datos = await apiRequest(`ventas?page=${p}&size=${s}`, null, {
        method: "GET",
      });
      setVentas(datos.content || []);
      setTotalPages(datos.totalPages || 0);
      setPage(datos.pageNumber || 0);
    } catch {
      toast.error("Error cargando ventas");
    }
    setLoading(false);
  }

  async function verDetalleVenta(venta) {
    setDetalleCargando(true);
    try {
      const data = await apiRequest(`ventas/${venta.id}`, null, {
        method: "GET",
      });
      setVentaDetalle(data);
    } catch {
      toast.error("No se pudo cargar el detalle de la venta");
    }
    setDetalleCargando(false);
  }

  function solicitarCancelacion(ventaId) {
    setModalConfirmacion({
      visible: true,
      mensaje: "¿Seguro que quieres cancelar esta venta?",
      onConfirmar: async () => {
        setModalConfirmacion((m) => ({ ...m, visible: false }));
        try {
          await apiRequest(`ventas/${ventaId}/cancelar`, null, {
            method: "PATCH",
          });
          toast.success("Venta cancelada");
          fetchVentas();
        } catch {
          toast.error("No se pudo cancelar la venta");
        }
      },
    });
  }

  function abrirPago(venta) {
    setModalPago({
      visible: true,
      venta,
      totalPendiente: venta.saldo ?? (venta.total - (venta.montoPagado || 0)),
    });
  }

  async function confirmarPago(monto) {
    if (!modalPago.venta) return;
    try {
      await apiRequest(
        `ventas/${modalPago.venta.id}/pago`,
        { monto },
        { method: "POST" }
      );
      toast.success("Pago registrado");
      cerrarModalPago();
      fetchVentas();
    } catch {
      toast.error("Error registrando el pago");
    }
  }

  function cerrarModalPago() {
    setModalPago({ visible: false, venta: null, totalPendiente: 0 });
  }

  return {
    ventas,
    loading,
    page,
    totalPages,
    setPage,
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
    fetchVentas,
  };
}
