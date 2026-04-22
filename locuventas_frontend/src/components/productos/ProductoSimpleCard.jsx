import React from "react";

const API_URL = import.meta.env.VITE_API_URL;

// Lógica de limpieza de ruta movida fuera para no re-procesar en cada render
const getProductImage = (foto) => {
  if (!foto) return null;
  const path = foto.includes("/") ? foto : `productos/${foto}`;
  return `${API_URL}/imagenes/${path}`;
};

export default function ProductoSimpleCard({ producto, cantidad, onAdd }) {
  const hasQuantity = cantidad > 0;

  return (
    <div
      onClick={() => onAdd && onAdd(producto)}
      className={`
        relative overflow-hidden rounded-2xl bg-zinc-900 border transition-all duration-300 group
        flex flex-col p-4 gap-3 w-full max-w-[260px] h-[280px] cursor-pointer select-none
        ${hasQuantity 
          ? "border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]" 
          : "border-zinc-800 hover:border-zinc-600 shadow-xl"
        }
        hover:-translate-y-1
      `}
    >
      {/* 1. Badge de Cantidad (Elegante) */}
      {hasQuantity && (
        <div className="absolute top-3 right-3 z-10 animate-in zoom-in duration-300">
          <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs font-black text-black shadow-lg">
            {cantidad}
          </span>
        </div>
      )}

      {/* 2. Cabecera: Nombre e ID */}
      <div className="flex flex-col min-h-[44px]">
        <span className="font-bold text-zinc-500 uppercase tracking-widest">
          #{producto.id}
        </span>
        <h3 title={producto.nombre} className="font-bold text-zinc-100 text-base leading-tight line-clamp-2 group-hover:text-orange-400 transition-colors">
          {producto.nombre}
        </h3>
      </div>

      {/* 3. Imagen del Producto */}
      <div className="relative flex justify-center items-center h-28 bg-zinc-800/50 rounded-xl border border-zinc-700/30 overflow-hidden">
        {producto.foto ? (
          <img
            src={getProductImage(producto.foto)}
            alt={producto.nombre}
            className="h-24 w-24 object-contain transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center text-zinc-600 italic">
             <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
             <span className="text-[10px] mt-1">Sin imagen</span>
          </div>
        )}
        
        {/* Overlay de hover sutil */}
        <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors" />
      </div>
{/* 4. Info Inferior */}
      <div className="flex flex-col mt-auto pt-2 border-t border-zinc-800/50">
  
  {/* Fila 1: Categorías (Ocupa todo el ancho arriba del precio) */}
  {producto.categorias?.length > 0 && (
    <div className="mb-1">
      <span 
        className="text-[10px] text-zinc-500 block truncate" 
        title={producto.categorias.join(", ")}
      >
        {producto.categorias[0]} {producto.categorias.length > 1 && `+${producto.categorias.length - 1}`}
      </span>
    </div>
  )}

  {/* Fila 2: Precio y País (Distribución extremos) */}
  <div className="flex justify-between items-end gap-2">
    <div className="flex flex-col">
      <span className="text-xl font-black text-white whitespace-nowrap">
        {producto.precio.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
        <span className="text-sm text-orange-500 ml-0.5">€</span>
      </span>
    </div>

    {/* País (Tamaño fijo para que no baile) */}
    {producto.paisNombre && (
      <div className="flex items-center gap-1.5 bg-zinc-800/80 px-2 py-1 rounded-md border border-zinc-700 shrink-0">
        {producto.paisFoto && (
          <img
            src={producto.paisFoto}
            alt={producto.paisNombre}
            className="w-4 h-2.5 object-cover rounded-sm"
          />
        )}
        <span className="text-zinc-400 text-[9px] font-bold uppercase" title={producto.paisNombre}>
          {producto.paisNombre.substring(0, 3)}
        </span>
      </div>
    )}
  </div>
</div>

    </div>
  );
}