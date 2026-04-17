import React, { useState, useEffect } from "react";
import AppLayout from "@layout/AppLayout";
import Main from "@layout/Main";
import ContenedorVentas from "@components/ventas/ContenedorVentas";
import useVentasManager from "@hooks/useVentasManager";

// Modales
import ModalPago from "@components/ventas/ModalPago";
import ModalConfirmacion from "@components/common/ModalConfirmacion";
import ModalDetalleVenta from "@components/ventas/ModalDetalleVenta";

export default function VentasPendientesPagina() {
  // --- Usamos el Hook Maestro configurado para "pendientes" ---
  const {
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
    size,
    setSize
  } = useVentasManager("pendientes"); // <--- El parámetro mágico

  // --- Lógica de Responsive (se mantiene para el ContenedorVentas) ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AppLayout>
      <Main>
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Ventas Pendientes
          </h1>
          <p className="text-zinc-400 mt-1">
            Listado de operaciones con saldo pendiente de cobro.
          </p>
        </header>

        {loading ? (
          <div className="text-center text-orange-500 py-20 animate-pulse font-medium">
            Buscando facturas pendientes...
          </div>
        ) : (
          <ContenedorVentas
            ventas={ventas}
            loading={loading}
            isMobile={isMobile}
            onVerDetalle={verDetalleVenta}
            onCancelar={(v) => solicitarCancelacion(v.id)}
            onCobrar={abrirPago}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            size={size}
            onSizeChange={setSize}
          />
        )}
      </Main>

      {/* --- Capa de Modales Unificada --- */}

      {/* 1. Modal Pago */}
      {modalPago.visible && (
        <ModalPago
          totalPendiente={modalPago.totalPendiente}
          onConfirmar={confirmarPago}
          onCancelar={cerrarModalPago}
          confirmText="Cobrar"
        />
      )}

      {/* 2. Modal Confirmación (Cancelación) */}
      {modalConfirmacion.visible && (
        <ModalConfirmacion
          mensaje={modalConfirmacion.mensaje}
          confirmText="Sí, cancelar"
          onConfirmar={modalConfirmacion.onConfirmar}
          onCancelar={() =>
            setModalConfirmacion((m) => ({ ...m, visible: false }))
          }
        />
      )}

      {/* 3. Modal Detalle */}
      {ventaDetalle && (
        <ModalDetalleVenta
          venta={ventaDetalle}
          loading={detalleCargando}
          onClose={() => setVentaDetalle(null)}
        />
      )}
    </AppLayout>
  );
}