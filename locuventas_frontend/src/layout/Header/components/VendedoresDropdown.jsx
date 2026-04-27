// src/components/vendedor/VendedoresDropdown.jsx
import React from "react";
import PendientesList from "@components/vendedor/PendientesList";
import DropdownContainer from "@components/common/DropdownContainer";
import BotonClaro from "@components/common/BotonClaro";
import useBreakpoint from "@hooks/useBreakpoint";

export default function VendedoresDropdown({
  isOpen,
  onClickPendientes,
  isPendientesOpen,
  onConfirmacion,
}) {
  const breakpoint = useBreakpoint();
  const isSmall = ["xs", "sm", "md"].includes(breakpoint);

  return (
    <DropdownContainer
      isOpen={isOpen}
      side="right"
      arrowOffset="68px"
      width="w-60"
      className="absolute right-[calc(100%+12px)] top-0"
    >
      <div className="space-y-1">
        {/* Contenedor relativo del Botón + Dropdown Nivel 3 */}
        <div className="relative">
          <BotonClaro
            onClick={(e) => {
              e.stopPropagation();
              onClickPendientes();
            }}
            className={`flex justify-between items-center transition-colors ${
              isPendientesOpen ? "bg-orange-500/20 text-orange-400" : ""
            }`}
          >
            Pendientes de aprobar
          </BotonClaro>

          {/* NIVEL 3: Panel de Aprobación (Drop independiente) */}
          <DropdownContainer
            isOpen={isPendientesOpen}
            // LÓGICA DE POSICIÓN
            side={isSmall ? "top" : "right"} 
            arrowOffset={isSmall ? "20px" : "28px"}
            width={isSmall ? "w-[350px]" : "w-[380px]"}
            className={
              isSmall
                ? "absolute top-full mt-3 left-0 z-[60]" // Debajo en pantallas pequeñas
                : "absolute right-[calc(100%+12px)] -top-4 z-[60]" // Lateral en grandes
            }
          >
            <PendientesList
              onClose={onClickPendientes}
              onConfirmacion={onConfirmacion}
            />
          </DropdownContainer>
        </div>

        <div className="h-[1px] bg-zinc-800/50 my-1 mx-1" />

        <BotonClaro className="text-[11px] uppercase font-bold tracking-tighter hover:text-orange-400">
          Gestionar Vendedores
        </BotonClaro>
      </div>
    </DropdownContainer>
  );
}