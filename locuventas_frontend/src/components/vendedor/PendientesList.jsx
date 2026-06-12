// src/components/vendedor/PendientesList.jsx
import React, { useState } from "react";
import useVendedoresPendientes from "@hooks/useVendedoresPendientes";
import TarjetaVendedor from "@components/vendedor/TarjetaVendedor";
import Paginacion from "@components/common/Paginacion";
import BuscadorInput from "@components/common/BuscadorInput";

export default function PendientesList({
  onConfirmacion,
  page: externalPage,
  size: externalSize,
  onPageChange,
  onSizeChange,
}) {
  const [internalPage, setInternalPage] = useState(0);
  const [internalSize, setInternalSize] = useState(5);
  const [search, setSearch]             = useState("");

  const page = externalPage ?? internalPage;
  const size = externalSize ?? internalSize;

  const { pendientes, loading, totalPages, aprobar, eliminar } =
    useVendedoresPendientes({ page, size, search });

  const handlePageChange = onPageChange ?? setInternalPage;
  const handleSizeChange = onSizeChange ?? ((s) => { setInternalSize(s); setInternalPage(0); });

  // Al buscar, volver a página 0
  const handleSearch = (v) => {
    setSearch(v);
    handlePageChange(0);
  };

  const handleAction = (usuario, type) => {
    onConfirmacion({
      mensaje: type === "aprobar"
        ? `¿Aprobar a ${usuario.nombre}?`
        : `¿Eliminar a ${usuario.nombre}?`,
      confirmText: type === "aprobar" ? "Aprobar" : "Eliminar",
      onConfirmar: () => type === "aprobar" ? aprobar(usuario.id) : eliminar(usuario.id),
    });
  };

  return (
    <div className="flex flex-col h-full">
      <header className="px-2 pb-3 border-b border-zinc-800">
        <h4 className="text-white font-bold text-[10px] uppercase tracking-widest opacity-70 mb-2">
          Panel de Aprobación
        </h4>
        <BuscadorInput
          value={search}
          onChange={handleSearch}
          placeholder="Buscar por nombre o email..."
        />
      </header>

      <div className="mt-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
        {loading ? (
          <p className="text-orange-500 text-center py-10 animate-pulse text-xs">Cargando...</p>
        ) : pendientes.length === 0 ? (
          <p className="text-zinc-500 text-center py-10 italic text-xs">
            {search ? "Sin resultados" : "Sin registros"}
          </p>
        ) : (
          <ul className="space-y-3">
            {pendientes.map(u => (
              <TarjetaVendedor
                key={u.id}
                usuario={u}
                onAprobar={(u) => handleAction(u, "aprobar")}
                onDenegar={(u) => handleAction(u, "eliminar")}
              />
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-2 border-t border-zinc-800 pt-2">
          <Paginacion
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            size={size}
            onSizeChange={handleSizeChange}
          />
        </div>
      )}
    </div>
  );
}