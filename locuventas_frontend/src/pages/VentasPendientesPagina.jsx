import React, { useState, useEffect } from "react";
import Header from "@components/Header";
import Footer from "@components/Footer";
import TablaVentas from "@components/ventas/TablaVentas";
import VentaCard from "@components/ventas/VentaCard";
import ModalPago from "@components/ventas/ModalPago";
import ModalDetalleVenta from "@components/ventas/ModalDetalleVenta"; // <--- IMPORTANTE
import Paginacion from "@components/common/Paginacion";
import { apiRequest } from "@services/api";
import { toast } from "react-toastify";

export default function VentasPendientesPagina() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [ventaDetalle, setVentaDetalle] = useState(null);
  const [detalleCargando, setDetalleCargando] = useState(false); // <--- Corregido aquí

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  async function onVerDetalle(venta) {
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

  useEffect(() => {
    fetchVentas(page, size);
    // eslint-disable-next-line
  }, [page, size]);

  async function fetchVentas(p = page, s = size) {
    setLoading(true);
    try {
      const datos = await apiRequest(
        `ventas/pendientes?page=${p}&size=${s}`,
        null,
        { method: "GET" }
      );
      setVentas(datos.content || []);
      setTotalPages(datos.totalPages || 0);
      setPage(datos.pageNumber || 0);
    } catch {
      toast.error("Error al cargar ventas pendientes");
    }
    setLoading(false);
  }

  async function onCancelarVenta(ventaId) {
    if (!window.confirm("¿Seguro que quieres cancelar esta venta?")) return;
    try {
      await apiRequest(`ventas/${ventaId}/cancelar`, null, { method: "PATCH" });
      toast.success("Venta cancelada");
      fetchVentas();
    } catch {
      toast.error("No se pudo cancelar la venta");
    }
  }

  function onCobrarResto(venta) {
    setVentaSeleccionada(venta);
    setModalPagoAbierto(true);
  }

  async function confirmarCobro(importe) {
    setModalPagoAbierto(false);
    if (!ventaSeleccionada) return;
    try {
      await apiRequest(
        `ventas/${ventaSeleccionada.id}/pago`,
        { monto: importe },
        { method: "POST" }
      );
      toast.success("Pago registrado correctamente");
      setVentaSeleccionada(null);
      fetchVentas();
    } catch {
      toast.error("Error al registrar el pago");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900">
      <Header />
      <div style={{ height: 80 }} />
      <main className="flex-1 max-w-5xl mx-auto p-2 pt-8 w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-white drop-shadow">
          Pendientes de pago
        </h1>
        {loading ? (
          <div className="text-center text-gray-500 py-10">
            Cargando ventas pendientes...
          </div>
        ) : (
          <>
            {!isMobile && (
              <>
                <TablaVentas
                  ventas={ventas}
                  onVerDetalle={onVerDetalle}
                  onCancelarVenta={venta => onCancelarVenta(venta.id)}
                  onCobrarResto={onCobrarResto}
                />
                {totalPages > 1 && (
                  <Paginacion
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                )}
              </>
            )}
            {isMobile && (
              <div className="flex flex-col gap-4 pb-20">
                {ventas.length === 0 && (
                  <div className="py-8 text-center text-gray-400 bg-white rounded-xl shadow-lg">
                    No hay ventas pendientes
                  </div>
                )}
                {ventas.map((venta) => (
                  <VentaCard
                    key={venta.id}
                    venta={venta}
                    onDetalle={onVerDetalle}
                    onCancelar={onCancelarVenta}
                    onCobrarResto={onCobrarResto}
                  />
                ))}
                {totalPages > 1 && (
                  <Paginacion
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />

      {/* Modal de Cobro */}
      {modalPagoAbierto && ventaSeleccionada && (
        <ModalPago
          totalPendiente={ventaSeleccionada.saldo ?? ventaSeleccionada.total}
          onConfirmar={confirmarCobro}
          onCancelar={() => {
            setModalPagoAbierto(false);
            setVentaSeleccionada(null);
          }}
          confirmText="Cobrar"
        />
      )}

      {/* Modal de Detalle */}
      {ventaDetalle && (
        <ModalDetalleVenta
          venta={ventaDetalle}
          loading={detalleCargando}
          onClose={() => setVentaDetalle(null)}
        />
      )}
    </div>
  );
}
