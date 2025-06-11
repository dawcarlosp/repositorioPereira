import React from "react";
import BotonClaro from "./BotonClaro";
import PendientesList from "./PendientesList";
import { toast } from "react-toastify";
export default function VendedoresDropdown({
  isOpen,
  onClickPendientes,
  isPendientesOpen,
  onConfirmacion,
}) {
  if (!isOpen) return null;

  return (
    <div className="relative z-40">
      <div className="absolute right-full top-[-80px] -translate-y-1/2 -mr-[-10px] w-52 bg-zinc-900/90 backdrop-blur-md shadow-xl rounded-xl py-2">
        <div className="absolute -right-2 top-[36px] w-4 h-4 rotate-45 bg-zinc-900/90 z-40" />
        <div className="px-2 space-y-1">
          <div className="relative">
            <BotonClaro onClick={onClickPendientes}>
              Pendientes de aprobar
            </BotonClaro>
            {isPendientesOpen && (
              <div className="absolute right-full top-[36px] mr-3 z-30">
                <PendientesList onClose={onClickPendientes} onConfirmacion={onConfirmacion} />
              </div>
            )}
          </div>
          <BotonClaro onClick={() => toast.dark("Gestión de vendedores, llegará próximamente!")}>
            Gestionar Vendedores
          </BotonClaro>
        </div>
      </div>
    </div>
  );
}
