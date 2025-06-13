// Dashboard.jsx actualizado para que el footer no sea empujado y aside funcione bien
import React, { useEffect, useState, useRef } from "react";
import Header from "@components/Header";
import Aside from "@components/Aside";
import Main from "@components/Main";
import Footer from "@components/Footer";
import { apiRequest } from "@services/api";
import ModalPago from "@components/ventas/ModalPago";
import { toast } from "react-toastify";
import ModalDetalleVenta from "@components/ventas/ModalDetalleVenta";

function Dashboard() {
  const headerRef = useRef();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [carga, setCarga] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ventaEnCurso, setVentaEnCurso] = useState(null);
  const [ventaFinalizada, setVentaFinalizada] = useState(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

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

  async function guardarVentaSinCobrar() {
    const lineas = carga.map((item) => {
      const precio = Number(item.producto.precio);
      const iva = Number(item.producto.iva || 0);
      const precioConIva = precio * (1 + iva / 100);
      return {
        productoId: item.producto.id,
        cantidad: item.cantidad,
        subtotal: +(precioConIva * item.cantidad).toFixed(2),
      };
    });

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
    const lineas = carga.map((item) => {
      const precio = Number(item.producto.precio);
      const iva = Number(item.producto.iva || 0);
      const precioConIva = precio * (1 + iva / 100);
      return {
        productoId: item.producto.id,
        cantidad: item.cantidad,
        subtotal: +(precioConIva * item.cantidad).toFixed(2),
      };
    });

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
        { method: "POST" }
      );
      setCarga([]);
      setVentaEnCurso(null);
      toast.success("Pago registrado correctamente");
      setVentaFinalizada(actualizada);
    } catch {
      toast.error("Error al registrar el pago");
    }
  }

  const maxWidth = "max-w-[1400px] mx-auto";

  return (
    <div className="min-h-screen flex flex-col bg-zinc-900">
      <div
        style={{
          position: "fixed",
          width: "100%",
          zIndex: 50,
          top: 0,
          left: 0,
        }}
      >
        <Header ref={headerRef} />
      </div>

      <div style={{ height: headerHeight || 100 }} />

      <div className={`${maxWidth} flex flex-col md:flex-row flex-1 min-h-0 w-full`}>
        <main className="flex-1 flex flex-col overflow-auto min-h-0">
          <Main carga={carga} agregarProducto={agregarProducto} />
        </main>

        <aside
          className="w-full md:w-[370px] flex flex-col min-h-0"
          style={{
            maxHeight: `calc(75vh - ${headerHeight}px)`,
            position: "sticky",
            top: headerHeight || 100,
            background: "#fff",
            border: "2px solid orange",
            borderLeft: "none",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            overflow: "hidden",
          }}
        >
          <Aside
            carga={carga}
            quitarProducto={quitarProducto}
            onGuardarVenta={guardarVentaSinCobrar}
            onFinalizarYCobrar={finalizarYCobrar}
          />
        </aside>
      </div>

      <div className={`w-full ${maxWidth} mt-auto`}>
        <Footer />
      </div>

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
    </div>
  );
}

export default Dashboard;
