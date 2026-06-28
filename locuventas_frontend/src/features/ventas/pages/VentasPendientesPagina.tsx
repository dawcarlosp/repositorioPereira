import AppLayout from "@layout/AppLayout";
import Main from "@layout/Main";
import ContenedorVentas from "../components/ContenedorVentas";
import useVentasManager from "../hooks/useVentasManager";
import ModalPago from "../components/ModalPago";
import ModalConfirmacion from "@components/common/ModalConfirmacion";
import ModalDetalleVenta from "../components/ModalDetalleVenta";

export default function VentasPendientesPagina() {
  const {
    ventas, loading,
    page, totalPages, setPage,
    size, setSize,
    modalPago, abrirPago, confirmarPago, cerrarModalPago,
    modalConfirmacion, setModalConfirmacion, solicitarCancelacion,
    verDetalleVenta, ventaDetalle, setVentaDetalle, detalleCargando,
  } = useVentasManager("pendientes");

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

        <ContenedorVentas
          ventas={ventas}
          loading={loading}
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

      {modalPago.visible && (
        <ModalPago
          totalPendiente={modalPago.totalPendiente}
          onConfirmar={confirmarPago}
          onCancelar={cerrarModalPago}
          confirmText="Cobrar"
        />
      )}

      {modalConfirmacion.visible && (
        <ModalConfirmacion
          mensaje={modalConfirmacion.mensaje}
          confirmText="Sí, cancelar"
          onConfirmar={modalConfirmacion.onConfirmar}
          onCancelar={() => setModalConfirmacion((m) => ({ ...m, visible: false }))}
        />
      )}

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
