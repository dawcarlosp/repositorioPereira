import { useState, useEffect } from "react";
import type { Venta, VentaDetalle } from "@domain/venta.types";
import type { CarritoItem } from "@hooks/useCarrito";
import AppLayout from "@layout/AppLayout";
import Aside from "@layout/Aside";
import Main from "@layout/Main";
import { useHeader } from "@context/HeaderContext";
import CarritoVenta from "@components/ventas/CarritoVentas";
import CatalogoProductos from "@components/products/CatalogoProductos";
import ModalPago from "@components/ventas/ModalPago";
import ModalDetalleVenta from "@components/ventas/ModalDetalleVenta";
import { apiRequest } from "@services/api";
import { useCarrito } from "@hooks/useCarrito";
import DrawerCarrito from "@components/ventas/DrawerCarrito";
import useBreakpoint from "@hooks/useBreakpoint";
import { isBreakpoint, BREAKPOINTS } from "@constants/breakpoints";
import { toast } from "react-toastify";
import FAB from "@components/common/FAB";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  const [carga, setCarga] = useState<CarritoItem[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ventaEnCurso, setVentaEnCurso] = useState<Venta | null>(null);
  const [ventaFinalizada, setVentaFinalizada] = useState<VentaDetalle | null>(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(12);

  const { menuOpen } = useHeader();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { total } = useCarrito(carga);

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  function agregarProducto(prod: { id: number; precio: number; iva: number }) {
    setCarga((prev) => {
      const idx = prev.findIndex((item) => item.producto.id === prod.id);
      if (idx >= 0) {
        const newCarga = [...prev];
        newCarga[idx] = {
          ...newCarga[idx],
          cantidad: newCarga[idx].cantidad + 1,
        };
        return newCarga;
      } else {
        return [...prev, { producto: prod as never, cantidad: 1 }];
      }
    });
  }

  function quitarProducto(id: number) {
    setCarga((prev) => {
      const idx = prev.findIndex((item) => item.producto.id === id);
      if (idx === -1) return prev;
      if (prev[idx].cantidad === 1) {
        return prev.filter((item) => item.producto.id !== id);
      } else {
        const newCarga = [...prev];
        newCarga[idx] = {
          ...newCarga[idx],
          cantidad: newCarga[idx].cantidad - 1,
        };
        return newCarga;
      }
    });
  }

  const prepararLineas = () => {
    return carga.map((item) => {
      const precio = Number(item.producto.precio);
      const iva = Number(item.producto.iva || 0);
      const precioConIva = precio * (1 + iva / 100);
      return {
        productoId: item.producto.id,
        cantidad: item.cantidad,
        subtotal: +(precioConIva * item.cantidad).toFixed(2),
      };
    });
  };

  async function guardarVentaSinCobrar() {
    if (carga.length === 0) { toast.warning("El carrito está vacío"); return; }
    const lineas = prepararLineas();
    try {
      const venta = await apiRequest<VentaDetalle>("ventas", { lineas }, { method: "POST" });
      setCarga([]);
      setVentaFinalizada(venta);
      toast.success("Venta guardada sin cobrar");
    } catch (err) {
      const errorObj = err as { error?: string };
      toast.error(errorObj?.error || "Error al guardar la venta");
    }
  }

  async function finalizarYCobrar() {
    if (carga.length === 0) { toast.warning("El carrito está vacío"); return; }
    const lineas = prepararLineas();
    try {
      const venta = await apiRequest<Venta>("ventas", { lineas }, { method: "POST" });
      setVentaEnCurso({
        ...venta,
        total: lineas.reduce((sum, l) => sum + l.subtotal, 0),
      });
      setModalAbierto(true);
    } catch (err) {
      const errorObj = err as { error?: string };
      toast.error(errorObj?.error || "Error al crear la venta");
    }
  }

  async function confirmarPago(importe: number) {
    setModalAbierto(false);
    if (!ventaEnCurso) return;
    try {
      const actualizada = await apiRequest<VentaDetalle>(
        `ventas/${ventaEnCurso.id}/pago`,
        { monto: importe },
        { method: "POST" },
      );
      setCarga([]);
      setVentaEnCurso(null);
      setVentaFinalizada(actualizada);
      toast.success("Pago registrado correctamente");
    } catch {
      toast.error("Error al registrar el pago");
    }
  }

  const bp = useBreakpoint();
  const isMobile = bp === BREAKPOINTS.XS;

  const showSmallScreenFABs = !menuOpen && !isDrawerOpen && isBreakpoint(bp, "MOBILE");
  const showDrawer = isBreakpoint(bp, "SMALL_SCREENS");

  const totalItems = carga.reduce((acc, item) => acc + item.cantidad, 0);
  const totalVenta = carga.reduce((acc, item) => {
    const precio = Number(item.producto.precio);
    const iva = Number(item.producto.iva || 0);
    const precioConIva = precio * (1 + iva / 100);
    return acc + precioConIva * item.cantidad;
  }, 0);

  return (
    <AppLayout
      aside={
        <Aside>
          <CarritoVenta
            carga={carga}
            quitarProducto={quitarProducto}
            onGuardar={guardarVentaSinCobrar}
            onCobrar={finalizarYCobrar}
          />
        </Aside>
      }
    >
      <Main>
        <CatalogoProductos
          carga={carga}
          agregarProducto={agregarProducto}
          page={page}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          onPageChange={setPage}
          size={size}
          onSizeChange={handleSizeChange}
        />
        {showSmallScreenFABs && (

          <>
            <FAB
              index={0}
              icon={<FontAwesomeIcon icon={faShoppingCart} />}
              title="Ver Carrito"
              onClick={() => setIsDrawerOpen(true)}
              label={totalVenta > 0 ? `${totalVenta.toFixed(2)}€` : null}
            />

            <FAB
              index={1}
              variant="!bg-amber-500"
              icon={<FontAwesomeIcon icon={faClock} />}
              title="Poner venta en espera"
              onClick={guardarVentaSinCobrar}
            />

            <FAB
              index={2}
              variant="!bg-green-600"
              icon={<FontAwesomeIcon icon={faHandHoldingDollar} />}
              title="Finalizar y Cobrar"
              onClick={finalizarYCobrar}
            />
          </>
        )}
      </Main>

      {showDrawer && (
        <DrawerCarrito
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          carga={carga}
          quitarProducto={quitarProducto}
          onGuardar={guardarVentaSinCobrar}
          onCobrar={finalizarYCobrar}
        />
      )}

      {modalAbierto && ventaEnCurso && (
        <ModalPago
          totalPendiente={
            ventaEnCurso.total?.toFixed(2) ?? ventaEnCurso.saldo?.toFixed(2)
          }
          onConfirmar={confirmarPago}
          onCancelar={() => {
            setModalAbierto(false);
            setVentaEnCurso(null);
          }}
        />
      )}

      {ventaFinalizada && (
        <ModalDetalleVenta
          venta={ventaFinalizada}
          onClose={() => setVentaFinalizada(null)}
        />
      )}
    </AppLayout>
  );
}

export default Dashboard;
