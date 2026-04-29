import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BotonClaro from "@components/common/BotonClaro";
import DropdownContainer from "@components/common/DropdownContainer";
import PendientesList from "@components/vendedor/PendientesList";
import useBreakpoint from "@hooks/useBreakpoint";
import {
  CircleArrowLeft,
  CircleArrowRight,
  CircleArrowDown,
  CircleArrowUp,
} from "lucide-react";

export default function AdminActionsPersonal({ h }) {
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();

  // Referencias para el posicionamiento exacto de la flecha
  const btnPersonalRef = useRef(null);
  const btnSolicitudesRef = useRef(null);

  // Estados locales
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isPersonalDropOpen, setIsPersonalDropOpen] = useState(false);

  if (!h) return null;
  const isSmall = ["xs", "sm"].includes(breakpoint);
  const isMedium = ["md"].includes(breakpoint);

  // --- LÓGICA PARA TABLET (MD) ---
  if (isMedium) {
    return (
      <div className="relative">
        <BotonClaro
          ref={btnPersonalRef}
          onClick={(e) => {
            e.stopPropagation();
            setIsPersonalDropOpen(!isPersonalDropOpen);
          }}
          className={`flex justify-between items-center w-full ${
            isPersonalDropOpen ? "text-orange-400 bg-zinc-800" : ""
          }`}
        >
          <div className="flex flex-row items-center gap-2">
            {isPersonalDropOpen ? (
              <CircleArrowRight className="opacity-50" size={16} />
            ) : (
              <CircleArrowLeft className="text-purple-500" size={16} />
            )}
            Personal
          </div>
        </BotonClaro>

        {isPersonalDropOpen && (
          <DropdownContainer
            isOpen={isPersonalDropOpen}
            triggerRef={btnPersonalRef}
            side="right"
            width="w-56"
            className="absolute right-[calc(100%+20px)] -top-2 z-[60]"
          >
            <div className="flex flex-col gap-1 p-1">
              <BotonClaro
                className="!h-9 !text-[10px] w-full !justify-start"
                onClick={() => {
                  h.closeAll?.();
                  navigate("/vendedores/pendientes");
                }}
              >
                Solicitudes nuevas
              </BotonClaro>

              <BotonClaro
                className="!h-9 !text-[10px] !justify-start"
                onClick={() => {
                  setIsPersonalDropOpen(false);
                  h.closeAll();
                  navigate("/vendedores/lista");
                }}
              >
                Lista de personal
              </BotonClaro>
            </div>
          </DropdownContainer>
        )}
      </div>
    );
  }

  // --- LÓGICA MÓVIL (XS, SM) ---
  if (isSmall) {
    return (
      <div className="flex flex-col gap-1">
        <BotonClaro
          onClick={(e) => {
            e.stopPropagation();
            setIsAccordionOpen(!isAccordionOpen);
          }}
          className={`flex justify-between items-center w-full ${
            isAccordionOpen ? "text-orange-400 bg-orange-500/10" : ""
          }`}
        >
          <div className="flex flex-row items-center gap-2">
            {isAccordionOpen ? <CircleArrowUp size={16} /> : <CircleArrowDown size={16} />}
            Personal
          </div>
        </BotonClaro>

        {isAccordionOpen && (
          <div className="pl-4 flex flex-col gap-1 border-l border-zinc-800 ml-3 my-1 animate-in slide-in-from-top-1">
            <BotonClaro
              className="!h-8 !text-[10px] !justify-start"
              onClick={() => {
                h.closeAll();
                navigate("/vendedores/pendientes");
              }}
            >
              SOLICITUDES NUEVAS
            </BotonClaro>
            <BotonClaro
              className="!h-8 !text-[10px] !justify-start"
              onClick={() => {
                h.closeAll();
                navigate("/vendedores/lista");
              }}
            >
              LISTA DE PERSONAL
            </BotonClaro>
          </div>
        )}
      </div>
    );
  }

  // --- LÓGICA DESKTOP (LG+) ---
  return (
    <div className="relative">
      <BotonClaro
        ref={btnPersonalRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsPersonalDropOpen(!isPersonalDropOpen);
        }}
        className={`flex justify-between items-center w-full ${
          isPersonalDropOpen ? "text-orange-400 bg-zinc-800" : ""
        }`}
      >
        <div className="flex flex-row items-center gap-2">
          {isPersonalDropOpen ? (
            <CircleArrowRight className="opacity-50" size={16} />
          ) : (
            <CircleArrowLeft className="text-purple-500" size={16} />
          )}
          Personal
        </div>
      </BotonClaro>

      {isPersonalDropOpen && (
        <DropdownContainer
          isOpen={isPersonalDropOpen}
          triggerRef={btnPersonalRef}
          side="right"
          width="w-56"
          className="absolute right-[calc(100%+20px)] -top-2 z-[60]"
        >
          <div className="flex flex-col gap-1 p-1">
            <div className="relative">
              <BotonClaro
                ref={btnSolicitudesRef}
                className={`!h-9 !text-[10px] w-full flex justify-between ${
                  h.isPendientesOpen ? "bg-orange-500/10 text-orange-400" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  h.setIsPendientesOpen(!h.isPendientesOpen);
                }}
              >
                <div className="flex flex-row items-center gap-2">
                  {h.isPendientesOpen ? (
                    <CircleArrowRight className="opacity-50" size={14} />
                  ) : (
                    <CircleArrowLeft className="text-purple-500" size={14} />
                  )}
                  Solicitudes nuevas
                </div>
              </BotonClaro>

              {h.isPendientesOpen && (
                <DropdownContainer
                  isOpen={h.isPendientesOpen}
                  triggerRef={btnSolicitudesRef}
                  side="right"
                  width="w-[380px]"
                  className="absolute right-[calc(100%+25px)] -top-10 z-[70]"
                >
                  <PendientesList
                    onClose={() => h.setIsPendientesOpen(false)}
                    onConfirmacion={h.abrirConfirmacionGlobal}
                  />
                </DropdownContainer>
              )}
            </div>

            <BotonClaro
              className="!h-9 !text-[10px] !justify-start"
              onClick={() => {
                setIsPersonalDropOpen(false);
                h.closeAll();
                navigate("/vendedores/lista");
              }}
            >
              Lista de personal
            </BotonClaro>
          </div>
        </DropdownContainer>
      )}
    </div>
  );
}