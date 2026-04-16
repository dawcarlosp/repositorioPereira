import React, { useState, useEffect } from "react";
import AppLayout from "@layout/AppLayout";
import Main from "@layout/Main";
import ContenedorVentas from "@components/ventas/ContenedorVentas";
import useVentasManager from "@hooks/useVentasManager";

// Modales
import ModalPago from "@components/ventas/ModalPago";
import ModalConfirmacion from "@components/common/ModalConfirmacion";
import ModalDetalleVenta from "@components/ventas/ModalDetalleVenta";

export default function VentasPagina() {
  // --- Hook de Gestión de Ventas ---
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
  } = useVentasManager();

  // --- Lógica de Responsive ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AppLayout>
      <Main>
        {/* Cabecera de la sección */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Historial de Ventas
          </h1>
          <p className="text-zinc-400 mt-1">
            Consulta y gestiona las transacciones realizadas.
          </p>
        </header>

        {/* Estado de carga o Lista de ventas */}
  
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
  
      </Main>

      {/* --- Capa de Modales (Copiada íntegramente de tu versión original) --- */}
      
      {/* 1. Modal Pago */}
      {modalPago.visible && modalPago.venta && (
        <ModalPago
          totalPendiente={modalPago.totalPendiente}
          onConfirmar={confirmarPago}
          onCancelar={cerrarModalPago}
          confirmText="Cobrar"
        />
      )}

      {/* 2. Modal Confirmación de Cancelación */}
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

      {/* 3. Modal Detalle de Venta */}
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