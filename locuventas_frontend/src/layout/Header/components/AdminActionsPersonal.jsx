// src/layout/Header/components/AdminActionsPersonal.jsx
import React, { useState } from 'react';
import BotonClaro from '@components/common/BotonClaro';
import DropdownContainer from "@components/common/DropdownContainer"; 
import PendientesList from "@components/vendedor/PendientesList";
import { useNavigate } from "react-router-dom";

export default function AdminActionsPersonal({ h }) {
  const navigate = useNavigate();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const isSmall = ["xs", "sm", "md"].includes(h.breakpoint);

  return (
    <div className="flex flex-col gap-1">
      {/* Botón de Nivel Superior: Siempre abre el acordeón abajo */}
      <BotonClaro
        onClick={(e) => {
          e.stopPropagation();
          setIsAccordionOpen(!isAccordionOpen);
        }}
        className={`flex justify-between items-center w-full transition-all ${
          isAccordionOpen ? "text-orange-400 bg-orange-500/10 border-orange-500/20" : ""
        }`}
      >
        <span className="font-bold text-[11px] uppercase tracking-wider">Personal</span>
        <span className={`transition-transform duration-300 ${isAccordionOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </BotonClaro>

      {/* Contenido del Acordeón: Botones de menor jerarquía */}
      {isAccordionOpen && (
        <div className="pl-4 pr-1 flex flex-col gap-1 border-l border-zinc-800 ml-3 my-1 animate-in slide-in-from-top-1 duration-200">
          
          <div className="relative">
            <BotonClaro
              onClick={(e) => {
                if (isSmall) {
                  // MÓVIL: Navegación directa para evitar que la caja quede mal
                  h.closeAll(); 
                  navigate("/vendedores/pendientes");
                } else {
                  // PC: Abre el panel de aprobación lateral
                  e.stopPropagation();
                  h.setIsPendientesOpen(!h.isPendientesOpen);
                }
              }}
              className={`!h-8 !py-0 !text-[10px] opacity-80 hover:opacity-100 flex justify-between items-center w-full ${
                h.isPendientesOpen && !isSmall ? "text-orange-400 bg-zinc-800/50" : ""
              }`}
            >
              <span>Solicitudes nuevas</span>
              {!isSmall && <span className="text-[9px] opacity-30">{"<"}</span>}
            </BotonClaro>

            {/* Panel Lateral (Nivel 3): Solo se renderiza en PC */}
            {!isSmall && h.isPendientesOpen && (
              <DropdownContainer
                isOpen={h.isPendientesOpen}
                side="right"
                arrowOffset="28px"
                width="w-[380px]"
                className="absolute right-[calc(100%+16px)] -top-12 z-[70]"
              >
                <PendientesList
                  onClose={() => h.setIsPendientesOpen(false)}
                  onConfirmacion={h.abrirConfirmacionGlobal}
                />
              </DropdownContainer>
            )}
          </div>

          <BotonClaro
            onClick={() => {
              h.closeAll();
              navigate("/vendedores/lista");
            }}
            className="!h-8 !py-0 !text-[10px] opacity-80 hover:opacity-100 !justify-start uppercase tracking-tighter"
          >
            Lista de personal
          </BotonClaro>
        </div>
      )}
    </div>
  );
}