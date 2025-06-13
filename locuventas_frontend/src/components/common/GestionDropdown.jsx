import React from "react";
import { useNavigate } from "react-router-dom";
import BotonClaro from "@components/common/BotonClaro";
import { toast } from "react-toastify";
export default function GestionDropdown({
  isOpen,
  vendedoresLinkRef,
  onClickVendedores,
  children,
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;


  return (
    <div className="absolute top-full left-0 z-50 w-44 bg-zinc-900/90 backdrop-blur-md shadow-xl rounded-xl py-2 my-2">
      {/* Flecha hacia el botón “Gestión” */}
      <div className="absolute -top-2 left-4 w-4 h-4 bg-zinc-900/90 rotate-45" />

      <div className="px-2 space-y-1">
        <BotonClaro onClick={() => navigate("/productos/gestion")}>
          Productos
        </BotonClaro>
        <BotonClaro ref={vendedoresLinkRef} onClick={onClickVendedores}>
          Vendedores
        </BotonClaro>
        <BotonClaro onClick={() => toast.dark("Gestión de categorías, llegará próximamente!")}>
          Categorías
        </BotonClaro>
      </div>

      {/* Anidamos aquí el panel de “Vendedores” */}
      {children}
    </div>
  );
}
