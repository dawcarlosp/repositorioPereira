import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Aside from "../components/Aside";
import Main from "../components/Main";
import Footer from "../components/Footer";
import { apiRequest } from "../services/api";
import ModalPago from "../components/ventas/ModalPago";
import { toast } from "react-toastify";

function Dashboard() {
  const headerRef = useRef();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [carga, setCarga] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ventaEnCurso, setVentaEnCurso] = useState(null);

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
    const lineas = carga.map((item) => ({
      productoId: item.producto.id,
      cantidad: item.cantidad,
      subtotal: Number(item.producto.precio) * item.cantidad,
    }));

    try {
      await apiRequest("ventas", { lineas }, { method: "POST" });
      setCarga([]);
      toast.success("Venta guardada sin cobrar");
    } catch {
      toast.error("Error al guardar la venta");
    }
  }

  async function finalizarYCobrar() {
    const lineas = carga.map((item) => ({
      productoId: item.producto.id,
      cantidad: item.cantidad,
      subtotal: Number(item.producto.precio) * item.cantidad,
    }));

    try {
      const venta = await apiRequest("ventas", { lineas }, { method: "POST" });
      setVentaEnCurso(venta);
      setModalAbierto(true);
    } catch {
      toast.error("Error al crear la venta");
    }
  }

  async function confirmarPago(importe) {
    setModalAbierto(false);
    if (!ventaEnCurso) return;

    try {
      await apiRequest(
        `ventas/${ventaEnCurso.id}/pago`,
        { monto: importe },
        { method: "POST" }
      );
      setCarga([]);
      setVentaEnCurso(null);
      toast.success("Pago registado correctamente");
    } catch {
      toast.error("Error al registrar el pago");
    }
  }

  const maxWidth = "max-w-[1400px]";

  return (
    <div className="min-h-screen flex flex-col bg-zinc-900">
      {/* Header fijo */}
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
      {/* Espacio para el header fijo */}
      <div style={{ height: headerHeight || 100 }} />
      {/* Main + Aside en wrapper centrado */}
      <div className={`flex flex-col md:flex-row flex-1 w-full ${maxWidth} mx-auto`}>
        <main className="flex-1 flex flex-col overflow-auto">
          <Main carga={carga} agregarProducto={agregarProducto} />
        </main>
        <aside
          className="md:w-[370px] w-full max-w-full md:max-w-sm min-w-[0]"
          style={{
            border: "2px solid orange",
            borderLeft: "none",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            height: `calc(90vh - ${headerHeight || 100}px)`,
            position: "sticky",
            top: headerHeight || 100,
            zIndex: 20,
            boxSizing: "border-box",
            background: "#fff",
          }}
        >
          <Aside
            carga={carga}
            quitarProducto={quitarProducto}
            headerHeight={headerHeight}
            onGuardarVenta={guardarVentaSinCobrar}
            onFinalizarYCobrar={finalizarYCobrar}
          />
        </aside>
      </div>
      {/* Footer, mismo ancho que el contenido principal */}
      <div className={`w-full ${maxWidth} mx-auto`}>
        <Footer />
      </div>
      {/* ModalPago */}
      {modalAbierto && ventaEnCurso && (
        <ModalPago
          totalPendiente={ventaEnCurso.saldo ?? ventaEnCurso.total}
          onConfirmar={confirmarPago}
          onCancelar={() => {
            setModalAbierto(false);
            setVentaEnCurso(null);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
