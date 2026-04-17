import React from "react";
import Paginacion from "@components/common/Paginacion";

// Componente interno para la fila animada
const FilaSkeleton = ({ cols }) => (
  <tr className="animate-pulse border-b border-zinc-800/50">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-6">
        <div className="h-3 bg-zinc-700/50 rounded-full w-full"></div>
      </td>
    ))}
  </tr>
);

export default function TablaLayout({
  children,
  paginaActual,
  totalPaginas,
  onPageChange,
  onSizeChange,
  size,
  columnas = [],
  loading = false,
}) {
  const showPaginador = totalPaginas > 1;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-zinc-800/50 border border-zinc-700/50 rounded-2xl shadow-2xl">
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f59e0b; }
        `}
      </style>

      {/* Area de Paginación */}
      {showPaginador && (
        <div className="backdrop-blur-md self-end">
          <Paginacion
            page={paginaActual}
            totalPages={totalPaginas}
            onPageChange={onPageChange}
            size={size}
            onSizeChange={onSizeChange}
          />
        </div>
      )}

       {/* Overlay sutil de carga sobre toda la tabla */}
      {loading && (
        <div className="absolute inset-0 z-30 bg-zinc-900/10 backdrop-blur-[1px] pointer-events-none transition-all duration-500" />
      )}

      {/* Area de Tabla */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-zinc-700/50">
              {columnas.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-4 sticky top-0 bg-zinc-800 text-zinc-400 font-semibold text-xs uppercase tracking-wider z-20 ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading 
              ? Array.from({ length: size }).map((_, i) => (
                  <FilaSkeleton key={i} cols={columnas.length} />
                ))
              : children
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
