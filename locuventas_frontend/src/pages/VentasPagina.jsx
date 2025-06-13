import React, { useState, useEffect } from "react";
import Header from "@components/Header";
import Footer from "@components/Footer";
import TablaVentas from "@components/ventas/TablaVentas";
import VentaCard from "@components/ventas/VentaCard";
import ModalPago from "@components/ventas/ModalPago";
import ModalConfirmacion from "@components/common/ModalConfirmacion";
import ModalDetalleVenta from "@components/ventas/ModalDetalleVenta";
import Paginacion from "@components/common/Paginacion";
import useVentasManager from "@hooks/useVentasManager";

export default function VentasPagina() {
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
  } = useVentasManager();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const maxWidth = "max-w-[1400px] mx-auto";

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900">
      <Header />
      <div style={{ height: 80 }} />
      <main className={`flex-1 w-full ${maxWidth} p-2 pt-8`}>
        <h1 className="text-2xl font-bold mb-6 text-center text-white drop-shadow">
          Ventas
        </h1>

        {loading ? (
          <div className="text-center text-gray-500 py-10">
            Cargando ventas...
          </div>
        ) : (
          <>
            {!isMobile && (
              <>
                <TablaVentas
                  ventas={ventas}
                  onVerDetalle={verDetalleVenta}
                  onCancelarVenta={(venta) => solicitarCancelacion(venta.id)}
                  onCobrarResto={abrirPago}
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
                    No hay ventas
                  </div>
                )}
                {ventas.map((venta) => (
                  <VentaCard
                    key={venta.id}
                    venta={venta}
                    onDetalle={verDetalleVenta}
                    onCancelar={(venta) => solicitarCancelacion(venta.id)}
                    onCobrarResto={abrirPago}
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

      <div className={`w-full ${maxWidth} mt-auto`}>
        <Footer />
      </div>

      {/* Modal Pago */}
      {modalPago.visible && modalPago.venta && (
        <ModalPago
          totalPendiente={modalPago.totalPendiente}
          onConfirmar={confirmarPago}
          onCancelar={cerrarModalPago}
          confirmText="Cobrar"
        />
      )}

      {/* Modal Confirmación */}
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

      {/* Modal Detalle */}
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
