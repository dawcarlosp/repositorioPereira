import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@services/api";
import { toast } from "react-toastify";
import type { Venta } from "@domain/venta.types";

interface LineaVentaDetalle {
  productoId:      number;
  productoNombre:  string;
  cantidad:        number;
  subtotal:        number;
  iva:             number;
  subtotalConIva:  number;
}

interface VentaDetalle extends Venta {
  lineas: LineaVentaDetalle[];
}

interface VentaPageDTO {
  content:     Venta[];
  totalPages:  number;
  pageNumber:  number;
}

interface ModalPagoState {
  visible:         boolean;
  totalPendiente:  number;
  venta:           Venta | null;
}

interface ModalConfirmacionState {
  visible:     boolean;
  mensaje:     string;
  onConfirmar: (() => Promise<void>) | null;
}

interface UseVentasManagerReturn {
  ventas:               Venta[];
  loading:              boolean;
  page:                 number;
  totalPages:           number;
  setPage:              (p: number) => void;
  size:                 number;
  setSize:              (s: number) => void;
  modalPago:            ModalPagoState;
  abrirPago:            (venta: Venta) => void;
  confirmarPago:        (importe: number) => Promise<void>;
  cerrarModalPago:      () => void;
  modalConfirmacion:    ModalConfirmacionState;
  setModalConfirmacion: React.Dispatch<React.SetStateAction<ModalConfirmacionState>>;
  solicitarCancelacion: (ventaId: number) => void;
  verDetalleVenta:      (venta: Venta) => Promise<void>;
  ventaDetalle:         VentaDetalle | null;
  setVentaDetalle:      React.Dispatch<React.SetStateAction<VentaDetalle | null>>;
  detalleCargando:      boolean;
}

export default function useVentasManager(
  tipo: "todas" | "pendientes" = "todas",
  pageInitial = 0,
): UseVentasManagerReturn {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(pageInitial);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(6);
  const [modalPago, setModalPago] = useState<ModalPagoState>({
    visible: false,
    totalPendiente: 0,
    venta: null,
  });
  const [modalConfirmacion, setModalConfirmacion] = useState<ModalConfirmacionState>({
    visible: false,
    mensaje: "",
    onConfirmar: null,
  });
  const [ventaDetalle, setVentaDetalle] = useState<VentaDetalle | null>(null);
  const [detalleCargando, setDetalleCargando] = useState(false);

  const fetchVentas = useCallback(
    async (p: number, s: number) => {
      setLoading(true);
      try {
        const endpoint = tipo === "pendientes"
          ? `ventas/pendientes?page=${p}&size=${s}`
          : `ventas?page=${p}&size=${s}`;

        const datos = await apiRequest<VentaPageDTO>(endpoint, null, { method: "GET" });

        setVentas(datos.content ?? []);
        setTotalPages(datos.totalPages ?? 0);
      } catch {
        toast.error("Error al obtener las ventas");
      } finally {
        setLoading(false);
      }
    },
    [tipo],
  );

  useEffect(() => {
    fetchVentas(page, size);
  }, [page, size, fetchVentas]);

  useEffect(() => {
    setPage(0);
  }, [size]);

  const verDetalleVenta = async (venta: Venta) => {
    setDetalleCargando(true);
    try {
      const data = await apiRequest<VentaDetalle>(`ventas/${venta.id}`, null, { method: "GET" });
      setVentaDetalle(data);
    } catch {
      toast.error("Error al cargar detalle");
    } finally {
      setDetalleCargando(false);
    }
  };

  const abrirPago = (venta: Venta) => {
    setModalPago({ visible: true, totalPendiente: venta.saldo, venta });
  };

  const cerrarModalPago = () =>
    setModalPago({ visible: false, totalPendiente: 0, venta: null });

  const confirmarPago = async (importe: number) => {
    if (!modalPago.venta) return;
    try {
      await apiRequest(
        `ventas/${modalPago.venta.id}/pago`,
        { monto: importe },
        { method: "POST" },
      );
      toast.success("Pago registrado");
      cerrarModalPago();
      fetchVentas(page, size);
    } catch {
      toast.error("Error en el pago");
    }
  };

  const solicitarCancelacion = (ventaId: number) => {
    setModalConfirmacion({
      visible: true,
      mensaje: "¿Seguro que quieres cancelar esta venta?",
      onConfirmar: async () => {
        try {
          await apiRequest(`ventas/${ventaId}/cancelar`, null, { method: "PATCH" });
          toast.success("Venta cancelada");
          setModalConfirmacion({ visible: false, mensaje: "", onConfirmar: null });
          fetchVentas(page, size);
        } catch {
          toast.error("Error al cancelar");
        }
      },
    });
  };

  return {
    ventas, loading, page, totalPages, setPage, size, setSize,
    modalPago, abrirPago, confirmarPago, cerrarModalPago,
    modalConfirmacion, setModalConfirmacion, solicitarCancelacion,
    verDetalleVenta, ventaDetalle, setVentaDetalle, detalleCargando,
  };
}
