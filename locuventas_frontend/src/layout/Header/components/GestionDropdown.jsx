import React from "react";
import { useNavigate } from "react-router-dom";
import BotonClaro from "@components/common/BotonClaro";
import { toast } from "react-toastify";

export default function GestionDropdown({ isOpen, onClickVendedores, children }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    // Se alinea a la derecha del botón "Gestión" para crecer hacia la izquierda si es necesario
    <div className="absolute top-full left-0 mt-2 z-50 w-48 bg-zinc-900 border border-zinc-800 shadow-2xl rounded-xl py-2 backdrop-blur-md">
      {/* Flechita apuntando arriba */}
      <div className="absolute -top-1.5 left-4 w-3 h-3 bg-zinc-900 border-t border-l border-zinc-800 rotate-45" />

      <div className="px-2 space-y-1 relative z-10">
        <BotonClaro onClick={() => navigate("/productos/gestion")}>
          Productos
        </BotonClaro>
        
        <BotonClaro onClick={onClickVendedores} className="flex justify-between items-center">
          <span>Vendedores</span>
          <span className="text-[10px] opacity-50">{"<"}</span>
        </BotonClaro>

        <BotonClaro onClick={() => toast.dark("Próximamente...")}>
          Categorías
        </BotonClaro>
      </div>

      {children}
    </div>
  );
}