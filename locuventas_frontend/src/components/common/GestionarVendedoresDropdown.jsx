// src/components/common/GestionarVendedoresDropdown.jsx
import React from "react";
import VendorRow from "./VendorRow";

/**
 * Igual que PendientesDropdown, pero recibe la lista completa
 * de vendedores ya autorizados / en gestión. Puede mostrar,
 * por ejemplo, un botón para “Desautorizar” a cada uno.
 */
export default function GestionarVendedoresDropdown({ vendedores, onUpdate }) {
  if (!vendedores || vendedores.length === 0) {
    return (
      <div className="absolute top-0 right-full mr-2 z-50 w-80 bg-zinc-900/90 backdrop-blur-md shadow-xl rounded-xl py-4 px-4 text-center text-gray-400">
        No hay vendedores registrados.
      </div>
    );
  }

  return (
    <div className="absolute top-0 right-full mr-2 z-50 w-80 bg-zinc-900/90 backdrop-blur-md shadow-xl rounded-xl py-4">
      <div className="absolute -right-2 top-4 w-4 h-4 rotate-45 bg-zinc-900/90" />

      {vendedores.map((user) => (
        <VendorRow
          key={user.id}
          id={user.id}
          nombre={user.nombre}
          foto={user.foto}
          onUpdate={onUpdate}
          // En “gestionar” quizá solo queramos desautorizar:
          soloDesautorizar={true}
        />
      ))}
    </div>
  );
}
