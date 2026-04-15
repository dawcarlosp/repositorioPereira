import React from "react";
import { useNavigate } from "react-router-dom";
import BotonClaro from "@components/common/BotonClaro";
import PendientesList from "@components/vendedor/PendientesList";

export default function VendedoresDropdown({
  isOpen,
  onClickPendientes,
  isPendientesOpen,
  onConfirmacion,
  closeAll 
}) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    /* NIVEL 2: Aparece a la IZQUIERDA de Gestión */
    <div className="absolute right-[102%] top-0 z-50">
      <div className="w-60 bg-zinc-900 border border-zinc-800 shadow-2xl rounded-xl py-2 backdrop-blur-md">
        <div className="px-2 space-y-1">
          
          {/* BOTÓN PENDIENTES -> Abre Nivel 3 a la izquierda */}
          <div className="relative">
            <BotonClaro 
              onClick={(e) => {
                e.stopPropagation();
                onClickPendientes(); // Aquí es donde fallaba
              }}
              className={`flex justify-between items-center transition-colors ${
                isPendientesOpen ? "bg-orange-500/20 text-orange-400" : ""
              }`}
            >
              <span className="text-[11px] uppercase font-bold tracking-tighter">Pendientes de aprobar</span>
              <span className="text-[10px] opacity-40">{"<"}</span>
            </BotonClaro>

            {/* NIVEL 3: Lista de personas (Más a la izquierda) */}
            {isPendientesOpen && (
              <div className="absolute right-[106%] top-[-8px] z-[60]">
                <PendientesList 
                  onClose={onClickPendientes} 
                  onConfirmacion={onConfirmacion} 
                />
              </div>
            )}
          </div>

          <div className="h-[1px] bg-zinc-800/50 my-1 mx-2" />

          {/* BOTÓN GESTIONAR -> Navega y cierra todo */}
          <BotonClaro 
            onClick={() => {
              if(closeAll) closeAll();
              navigate("/gestion/vendedores");
            }}
            className="text-[11px] uppercase font-bold tracking-tighter hover:text-orange-400"
          >
            Gestionar Vendedores
          </BotonClaro>
          
        </div>
      </div>
    </div>
  );
}