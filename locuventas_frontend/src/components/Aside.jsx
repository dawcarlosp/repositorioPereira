import React from "react";
import { useAuth } from "../context/useAuth";
import Boton from "./common/Boton";
import BotonClaro from "./common/BotonClaro";

function formateaFechaHora() {
  const d = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  return {
    fecha: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
    hora: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

function Aside({ carga, quitarProducto, headerHeight, onGuardarVenta, onFinalizarYCobrar }) {
  const { auth } = useAuth();
  const { fecha, hora } = formateaFechaHora();

  const base = carga.reduce((acc, item) => acc + item.cantidad * item.producto.precio, 0);
  const ivaTotal = carga.reduce(
    (acc, item) =>
      acc + (item.producto.iva ?? 0) / 100 * item.cantidad * item.producto.precio,
    0
  );
  const total = base + ivaTotal;

  const productosMaxHeight = `calc(100vh - ${(headerHeight || 100) + 220}px)`;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 pt-4 pb-2 border-b bg-white z-10">
        <div className="flex justify-between text-base font-normal text-zinc-900">
          <span>{fecha}</span>
          <span>Nº productos: <b>{carga.reduce((s, x) => s + x.cantidad, 0)}</b></span>
          <span>Hora {hora}</span>
        </div>
        <div className="text-center my-2">Atendido por <span className="font-bold">{auth?.nombre || "Usuario"}</span></div>
        <div className="text-center text-gray-400 text-sm mb-1">(Sin guardar)</div>
      </div>

      <div className="overflow-y-auto px-2 py-2" style={{ maxHeight: productosMaxHeight, flex: "1 1 0%" }}>
        {carga.length === 0 ? (
          <div className="text-gray-400 text-center py-10">No hay productos</div>
        ) : (
          carga.map((item) => (
            <div key={item.producto.id} className="flex justify-between gap-2 py-2 border-b">
              <span>{item.cantidad} {item.producto.nombre}</span>
              <div className="flex gap-2">
                <span>{(item.cantidad * item.producto.precio).toFixed(2)}€</span>
                <BotonClaro className="w-9 h-9 p-0" onClick={() => quitarProducto(item.producto.id)}>-</BotonClaro>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t p-4 pt-2 bg-white">
        <div className="flex justify-between text-sm"><span>Base imponible</span><span>{base.toFixed(2)}€</span></div>
        <div className="flex justify-between text-sm"><span>IVA total</span><span>{ivaTotal.toFixed(2)}€</span></div>
        <div className="flex justify-between items-center mt-3 text-xl font-bold">
          <span>Total</span><span>{total.toFixed(2)}€</span>
        </div>
        <div className="flex flex-col md:flex-row gap-3 mt-6">
          <Boton onClick={onGuardarVenta}>Guardar sin cobrar</Boton>
          <Boton onClick={onFinalizarYCobrar}>Finalizar y cobrar</Boton>
        </div>
      </div>
    </div>
  );
}

export default Aside;
