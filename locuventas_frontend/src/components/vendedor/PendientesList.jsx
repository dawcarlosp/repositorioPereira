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
    <div className="w-[380px] bg-zinc-900 border border-zinc-700 shadow-2xl rounded-2xl animate-fade-in">
      <header className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center bg-black/20">
        <h4 className="text-white font-bold text-xs uppercase tracking-widest">Panel de Aprobación</h4>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition">✕</button>
      </header>
      <div className="p-3 max-h-[450px] overflow-y-auto custom-scrollbar">
        {loading ? <p className="text-orange-500 text-center py-10 animate-pulse">Cargando...</p> : 
         pendientes.length === 0 ? <p className="text-zinc-500 text-center py-10 italic">Sin registros</p> :
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
        }
      </div>
    </div>
  );
}