import React, { useState, useEffect } from "react";
import AppLayout from "@layout/AppLayout";
import Aside from "@layout/Aside";
import Main from "@layout/Main";
import { useHeader } from "@context/HeaderContext";
import CarritoVenta from "@components/ventas/CarritoVentas";
import CatalogoProductos from "@components/productos/CatalogoProductos";
import ModalPago from "@components/ventas/ModalPago";
import ModalDetalleVenta from "@components/ventas/ModalDetalleVenta";
import { apiRequest } from "@services/api.config";
import { useCarrito } from "@hooks/useCarrito";
import DrawerCarrito from "@components/ventas/DrawerCarrito";
import useBreakpoint from "@hooks/useBreakpoint";
import { toast } from "react-toastify";
import FAB from "@components/common/FAB";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
function Dashboard() {
  // --- Estados ---
  const [carga, setCarga] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ventaEnCurso, setVentaEnCurso] = useState(null);
  const [ventaFinalizada, setVentaFinalizada] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(12);

  const { menuOpen } = useHeader();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { total } = useCarrito(carga);

  const handleSizeChange = (newSize) => {
    setSize(newSize);
    setPage(0); // Volvemos a la primera página siempre
  };

  // --- Lógica del Carrito ---
  function agregarProducto(prod) {
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
        return [...prev, { producto: prod, cantidad: 1 }];
      }
    });
  }

  function quitarProducto(id) {
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

  // --- Lógica de Negocio (Backend) ---
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
    if (carga.length === 0) return toast.warning("El carrito está vacío");
    const lineas = prepararLineas();
    try {
      const venta = await apiRequest("ventas", { lineas }, { method: "POST" });
      setCarga([]);
      setVentaFinalizada(venta);
      toast.success("Venta guardada sin cobrar");
    } catch (err) {
      toast.error(err?.error || "Error al guardar la venta");
    }
  }

  async function finalizarYCobrar() {
    if (carga.length === 0) return toast.warning("El carrito está vacío");
    const lineas = prepararLineas();
    try {
      const venta = await apiRequest("ventas", { lineas }, { method: "POST" });
      setVentaEnCurso({
        ...venta,
        total: lineas.reduce((sum, l) => sum + l.subtotal, 0),
      });
      setModalAbierto(true);
    } catch (err) {
      toast.error(err?.error || "Error al crear la venta");
    }
  }

  async function confirmarPago(importe) {
    setModalAbierto(false);
    if (!ventaEnCurso) return;
    try {
      const actualizada = await apiRequest(
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

  //Responsive
  const bp = useBreakpoint();
  const isMobile = bp === "xs";

  // Sumamos todas las cantidades de la carga
  const totalItems = carga.reduce((acc, item) => acc + item.cantidad, 0);
  const totalVenta = carga.reduce((acc, item) => {
    const precio = Number(item.producto.precio);
    const iva = Number(item.producto.iva || 0);
    const precioConIva = precio * (1 + iva / 100);
    return acc + precioConIva * item.cantidad;
  }, 0);
  // --- Renderizado ---
  return (
    <AppLayout
      isMobile={isMobile}
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
        {/*Botones visibles en algunas pantallas pequeñas*/}
        {(!menuOpen && !isDrawerOpen) && (bp == "xs" || bp == "sm") && (
          <>
            {/* 0. EL CARRITO (Base - Color Neutro) */}
            <FAB
              index={0}
              icon={<FontAwesomeIcon icon={faShoppingCart} />}
              title="Ver Carrito"
              onClick={() => setIsDrawerOpen(true)}
              label={totalVenta > 0 ? `${totalVenta.toFixed(2)}€` : null}
            />

            {/* 1. GUARDAR EN ESPERA (Intermedio - Color Alerta) */}
            <FAB
              index={1}
              variant="!bg-amber-500"
              icon={<FontAwesomeIcon icon={faClock} />}
              title="Poner venta en espera"
              onClick={guardarVentaSinCobrar}
            />

            {/* 2. FINALIZAR Y COBRAR (Cima - Color Éxito) */}
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

      {/* EL DRAWER PARA MÓVIL */}
      {(bp === "xs" || bp === "sm") && (
        <DrawerCarrito
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          carga={carga}
          quitarProducto={quitarProducto}
          onGuardar={guardarVentaSinCobrar}
          onCobrar={finalizarYCobrar}
        />
      )}

      {/* --- Capa de Modales --- */}
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
