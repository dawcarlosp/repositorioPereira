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
  const nombreUsuario = auth?.nombre || "Usuario";
  const { fecha, hora } = formateaFechaHora();

  // Totales
  const base = carga.reduce(
    (acc, item) => acc + item.cantidad * (Number(item.producto.precio) || 0),
    0
  );
  const iva = +(base * 0.21).toFixed(2);
  const total = +(base + iva).toFixed(2);

  // Calcula la altura de la zona scroll para que el footer del ticket siempre se vea
  // Ajusta 220px si tienes más/menos altura en los totales y botones, para que no tape
  const productosMaxHeight = `calc(100vh - ${(headerHeight || 100) + 220}px)`;

  return (
    <div className="flex flex-col h-full bg-white h-1">
      {/* Cabecera */}
      <div className="px-4 pt-4 pb-2 border-b bg-white z-10">
        <div className="flex flex-wrap justify-between text-base md:text-lg font-normal text-zinc-900">
          <span>{fecha}</span>
          <span>Número de productos: <b>{carga.reduce((sum, x) => sum + x.cantidad, 0)}</b></span>
          <span>Hora {hora}</span>
        </div>
        <div className="text-center my-1 md:my-2">
          Atendido por <span className="font-bold">{nombreUsuario}</span>
        </div>
        <div className="text-center text-gray-400 text-xs md:text-sm mb-1">
          (Sin guardar)
        </div>
      </div>
      {/* Zona de productos con SCROLL solo aquí */}
      <div
        className="overflow-y-auto px-2 py-2"
        style={{ maxHeight: productosMaxHeight, minHeight: 0, flex: "1 1 0%" }}
      >
        {carga.length === 0 ? (
          <div className="text-gray-400 text-center py-10">No hay productos</div>
        ) : (
          carga.map((item) => (
            <div
              key={item.producto.id}
              className="flex items-center justify-between gap-2 py-2 border-b"
            >
              <span>
                {item.cantidad} {item.producto.nombre}
              </span>
              <div className="flex items-center gap-2">
                <span>{(item.cantidad * (Number(item.producto.precio) || 0)).toFixed(2)}€</span>
                <BotonClaro
                  className="w-9 h-9 min-w-0 min-h-0 p-0"
                  onClick={() => quitarProducto(item.producto.id)}
                >-</BotonClaro>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Totales y botones: siempre visibles, no hacen scroll */}
      <div className="border-t p-4 pt-2 bg-white shrink-0">
        <div className="flex justify-between text-sm">
          <span>Base imponible</span>
          <span>{base.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>IVA (21%)</span>
          <span>{iva.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between items-center mt-3 text-xl font-bold">
          <span>Total</span>
          <span>{total.toFixed(2)}€</span>
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
