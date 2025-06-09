import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "../../services/api";
import ModalConfirmacion from "../common/ModalConfirmacion";
import Boton from "../common/Boton";
import BotonClaro from "../common/BotonClaro";
import TablaVentas from "./TablaVentas";
import VentaCard from "./VentaCard";
import ModalPago from "./ModalPago";

export default function GestionVentas() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    visible: false,
    mensaje: "",
    confirmText: "",
    onConfirmar: null,
    onCancelarCustom: null,
  });

  // Modal de pago
  const [modalPago, setModalPago] = useState({
    visible: false,
    venta: null,
    totalPendiente: 0,
  });

  // Detecta móvil
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 640
  );
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchVentas();
    // eslint-disable-next-line
  }, []);

  async function fetchVentas() {
    setLoading(true);
    try {
      const vtas = await apiRequest("ventas", null, { method: "GET" });
      setVentas(vtas);
    } catch {
      toast.error("Error cargando ventas");
    }
    setLoading(false);
  }

  // --- Acciones ---
  function abrirPago(venta) {
    setModalPago({
      visible: true,
      venta,
      totalPendiente: venta.saldo ?? (venta.total - (venta.montoPagado || 0)),
    });
  }

  async function registrarPago(monto) {
    const venta = modalPago.venta;
    try {
      await apiRequest(`ventas/${venta.id}/pago`, { monto }, { method: "POST" });
      toast.success("Pago registrado");
      setModalPago({ visible: false, venta: null, totalPendiente: 0 });
      fetchVentas();
    } catch {
      toast.error("Error registrando el pago");
    }
  }

  function cerrarModalPago() {
    setModalPago({ visible: false, venta: null, totalPendiente: 0 });
  }

  function confirmarCancelarVenta(id) {
    setModal({
      visible: true,
      mensaje: "¿Seguro que quieres cancelar esta venta?",
      confirmText: "Cancelar venta",
      onConfirmar: async () => {
        setModal((m) => ({ ...m, visible: false }));
        try {
          await apiRequest(`ventas/${id}/cancelar`, null, { method: "PATCH" });
          toast.success("Venta cancelada");
          fetchVentas();
        } catch {
          toast.error("No se pudo cancelar la venta");
        }
      },
      onCancelarCustom: null,
    });
  }

  function verDetalle(venta) {
    // Aquí podrías abrir otro modal o navegar a una página de detalles
    toast.info(`Detalle de venta #${venta.id} (impleméntalo tú 😎)`);
  }

  return (
    <>
      {/* MODAL CONFIRMACIÓN */}
      {modal.visible && (
        <ModalConfirmacion
          mensaje={modal.mensaje}
          confirmText={modal.confirmText}
          onConfirmar={modal.onConfirmar}
          onCancelar={
            modal.onCancelarCustom
              ? modal.onCancelarCustom
              : () => setModal((m) => ({ ...m, visible: false }))
          }
        />
      )}

      {/* MODAL DE PAGO */}
      {modalPago.visible && (
        <ModalPago
          totalPendiente={modalPago.totalPendiente}
          onConfirmar={registrarPago}
          onCancelar={cerrarModalPago}
        />
      )}

      <div className="min-h-screen bg-zinc-900 p-2 sm:p-4">
        <div className="max-w-7xl mx-auto rounded-2xl mt-4 sm:mt-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center text-white drop-shadow">
            Gestión de Ventas
          </h1>

          {/* TABLA EN ESCRITORIO / CARDS EN MÓVIL */}
          {!isMobile && (
            <TablaVentas
              ventas={ventas}
              onDetalle={verDetalle}
              onCancelar={confirmarCancelarVenta}
              onCobrar={abrirPago}
            />
          )}

          {/* CARDS EN MÓVIL */}
          {isMobile && (
            <div className="flex flex-col gap-4 pb-12">
              {ventas.length === 0 && (
                <div className="py-8 text-center text-gray-400 bg-white rounded-xl shadow-lg">
                  No hay ventas
                </div>
              )}
              {ventas.map((venta) => (
                <VentaCard
                  key={venta.id}
                  venta={venta}
                  onDetalle={verDetalle}
                  onCancelar={confirmarCancelarVenta}
                  onCobrar={abrirPago}
                />
              ))}
            </div>
          )}

          {loading && (
            <div className="text-center py-6 text-gray-500">
              Cargando ventas...
            </div>
          )}
        </div>
      </div>
    </>
  );
}
