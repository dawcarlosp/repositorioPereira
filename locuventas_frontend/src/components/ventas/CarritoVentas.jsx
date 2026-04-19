// src/components/ventas/CarritoVenta.jsx
import React from "react";
import { useAuth } from "@context/useAuth";
import { useCarrito } from "@hooks/useCarrito";
import Boton from "@components/common/Boton";
import BotonClaro from "@components/common/BotonClaro";

export default function CarritoVenta({ carga, quitarProducto, onGuardar, onCobrar }) {
  const { auth } = useAuth();
  const { base, iva, total, numProductos } = useCarrito(carga);
  
  const formato = (num) => 
    num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      
      {/* 1. HEADER: Información de la sesión */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-white font-bold text-lg tracking-tight">Carrito de Venta</h2>
          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-700">
            ID: {auth?.id || '001'}
          </span>
        </div>
        <p className="text-zinc-500 text-xs flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Atiende: <span className="text-zinc-300 font-medium">{auth?.nombre || "Usuario"}</span>
        </p>
      </div>
      
      {/* 2. LISTA: Productos (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {carga.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2 opacity-50">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-sm italic">Sin productos seleccionados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {carga.map((item) => (
              <div 
                key={item.producto.id} 
                className="flex items-center justify-between group animate-fadeIn"
              >
                <div className="flex flex-col">
                  <span className="text-sm text-zinc-200 font-semibold leading-tight">
                    {item.producto.nombre}
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    {item.cantidad} x {formato(item.producto.precio)}€
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">
                    {formato(item.cantidad * item.producto.precio)}€
                  </span>
                  <button 
                    onClick={() => quitarProducto(item.producto.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-500 hover:bg-rose-500/20 hover:text-rose-500 transition-all border border-zinc-700"
                    title="Quitar uno"
                  >
                    <span className="text-lg font-bold mt-[-2px]">-</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. FOOTER: Totales y Acciones */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Base Imponible</span>
            <span>{formato(base)}€</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-500">
            <span>IVA Total</span>
            <span>{formato(iva)}€</span>
          </div>
          <div className="flex justify-between items-end pt-2 border-t border-zinc-800">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-black">Total a pagar</p>
              <p className="text-3xl font-black text-orange-500 tracking-tighter">
                {formato(total)}<span className="text-lg ml-0.5">€</span>
              </p>
            </div>
            <div className="text-right">
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Items</p>
               <p className="text-lg font-bold text-white leading-none">{numProductos}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Boton 
            onClick={onCobrar}
            disabled={carga.length === 0}
            className="w-full !py-4 !bg-orange-500 !text-black font-black uppercase text-xs tracking-[2px] hover:!bg-orange-400 disabled:opacity-30"
          >
            Finalizar y Cobrar
          </Boton>
          <BotonClaro 
            onClick={onGuardar}
            disabled={carga.length === 0}
            className="w-full !py-3 !border-zinc-700 !text-zinc-400 hover:!text-white text-xs uppercase font-bold tracking-widest disabled:opacity-30"
          >
            Guardar en Espera
          </BotonClaro>
        </div>
      </div>
    </div>
  );
}