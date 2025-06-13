import React from "react";

const API_URL = import.meta.env.VITE_API_URL;

function resolverRutaFoto(foto) {
  if (!foto) return null;
  return foto.includes("/") ? foto : `productos/${foto}`;
}

export default function ProductoSimpleCard({ producto, cantidad }) {
  return (
    <div
      className={`
        relative rounded-xl bg-white/95 shadow-lg border-2 border-orange-400
        flex flex-col px-4 py-3 gap-2
        w-full max-w-[260px] h-[260px]
        transition-all duration-200
        hover:scale-[1.025] cursor-pointer select-none
      `}
    >
      {/* Nombre e ID */}
      <div className="flex items-center gap-2 mb-1 h-[36px] overflow-hidden">
        <span className="font-bold text-purple-600 text-base truncate">
          {producto.nombre}
        </span>
        <span className="text-sm text-zinc-400 whitespace-nowrap">#{producto.id}</span>
      </div>

      {/* Imagen */}
      <div className="flex justify-center items-center h-[84px]">
        {producto.foto ? (
          <img
            src={`${API_URL}/imagenes/${resolverRutaFoto(producto.foto)}`}
            alt={producto.nombre}
            className="h-[72px] w-[72px] object-contain bg-[#fafafa] rounded-lg shadow-sm"
          />
        ) : (
          <div className="h-[72px] w-[72px] bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-400 text-xs">
            Sin imagen
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-end mt-1 text-sm">
        <div className="text-zinc-800">
          <span className="font-bold">Precio: </span>{producto.precio}€
        </div>

        {producto.paisNombre && (
          <div className="flex items-center gap-2 mt-1">
            {producto.paisFoto && (
              <img
                src={producto.paisFoto}
                alt={producto.paisNombre}
                className="w-5 h-3.5 rounded shadow"
              />
            )}
            <span className="text-zinc-700 text-sm truncate">{producto.paisNombre}</span>
          </div>
        )}

        {producto.categorias?.length > 0 && (
          <div className="mt-1 text-xs">
            <span className="font-bold">Categorías: </span>
            <span className="text-zinc-700">
              {producto.categorias.join(", ")}
            </span>
          </div>
        )}
      </div>

      {cantidad > 0 && (
        <div className="absolute top-1 right-2 bg-orange-500 text-white rounded-full px-2 text-xs font-bold shadow">
          {cantidad}
        </div>
      )}
    </div>
  );
}
