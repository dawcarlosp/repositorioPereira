import React from "react";
import BotonClaro from "./BotonClaro";

export default function GestionDropdown({
  isOpen,
  vendedoresLinkRef,
  onClickVendedores,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 z-50 w-44 bg-zinc-900/90 backdrop-blur-md shadow-xl rounded-xl py-2 my-2">
      {/* Flecha hacia el botón “Gestión” */}
      <div className="absolute -top-2 left-4 w-4 h-4 bg-zinc-900/90 rotate-45" />

      <div className="px-2 space-y-1">
        <BotonClaro ref={vendedoresLinkRef} onClick={onClickVendedores}>
          Vendedores
        </BotonClaro>
        <BotonClaro>Categorías</BotonClaro>
        <BotonClaro>Productos</BotonClaro>
      </div>

      {/* Anidamos aquí el panel de “Vendedores” */}
      {children}
    </div>
  );
}
