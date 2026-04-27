// src/components/vendedor/PendientesList.jsx
import React from "react";
import useVendedoresPendientes from "@hooks/useVendedoresPendientes";
import TarjetaVendedor from "./TarjetaVendedor";

export default function PendientesList({ onClose, onConfirmacion }) {
  const { pendientes, loading, aprobar, eliminar } = useVendedoresPendientes();

  const handleAction = (usuario, type) => {
    onConfirmacion({
      mensaje: type === 'aprobar' ? `¿Aprobar a ${usuario.nombre}?` : `¿Eliminar a ${usuario.nombre}?`,
      confirmText: type === 'aprobar' ? "Aprobar" : "Eliminar",
      onConfirmar: () => type === 'aprobar' ? aprobar(usuario.id) : eliminar(usuario.id)
    });
  };

  return (
    // Quitamos los bordes y el fondo de aquí, ya los pone el DropdownContainer
    <div className="flex flex-col h-full">
      <header className="px-2 pb-3 border-b border-zinc-800 flex justify-between items-center">
        <h4 className="text-white font-bold text-[10px] uppercase tracking-widest opacity-70">
          Panel de Aprobación
        </h4>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition">✕</button>
      </header>

      <div className="mt-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
        {loading ? (
          <p className="text-orange-500 text-center py-10 animate-pulse text-xs">Cargando...</p>
        ) : pendientes.length === 0 ? (
          <p className="text-zinc-500 text-center py-10 italic text-xs">Sin registros</p>
        ) : (
          <ul className="space-y-3">
            {pendientes.map(u => (
              <TarjetaVendedor 
                key={u.id} 
                usuario={u} 
                onAprobar={(u) => handleAction(u, 'aprobar')} 
                onDenegar={(u) => handleAction(u, 'eliminar')} 
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}