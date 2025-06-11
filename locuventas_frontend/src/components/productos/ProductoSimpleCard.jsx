import React from "react";

export default function ProductoSimpleCard({ producto, cantidad }) {
  return (
    <div
      className={`relative rounded-xl bg-white/95 shadow-lg border-2 border-orange-400 flex flex-col px-4 py-3 gap-2
        w-full min-h-[180px] max-w-[300px] transition-all duration-200 box-border
        hover:scale-[1.025] cursor-pointer select-none
      `}
      style={{ boxSizing: "border-box" }}
    >
      {/* Nombre e ID */}
      <div className="flex items-center gap-3 mb-1">
        <span className="font-bold text-purple-600 text-lg">{producto.nombre}</span>
        <span className="text-sm text-zinc-400">#{producto.id}</span>
      </div>

      {/* Imagen */}
      <div className="flex justify-center items-center my-2 min-h-[80px] h-[80px]">
        {producto.foto ? (
          <img
            src={`http://localhost:8080/imagenes/productos/${producto.foto}`}
            alt={producto.nombre}
            className="h-16 w-auto rounded-lg shadow-md object-contain bg-[#fafafa]"
            style={{ maxWidth: "90%" }}
          />
        ) : (
          <div className="h-14 w-14 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-400 text-xs">
            Sin imagen
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="text-zinc-800">
          <span className="font-bold">Precio: </span>
          {producto.precio}€
        </div>
        {producto.paisNombre && (
          <div className="flex items-center gap-2 mt-1">
            {producto.paisFoto && (
              <img
                src={producto.paisFoto}
                alt={producto.paisNombre}
                className="w-6 h-4 rounded shadow"
              />
            )}
            <span className="text-zinc-700 text-sm">{producto.paisNombre}</span>
          </div>
        )}
        {producto.categorias?.length > 0 && (
          <div className="mt-1">
            <span className="font-bold text-xs">Categorías: </span>
            <span className="text-xs text-zinc-700">
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
