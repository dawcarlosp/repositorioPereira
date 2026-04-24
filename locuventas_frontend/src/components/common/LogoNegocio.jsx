import React from "react";
import { Link } from "react-router-dom";

function LogoNegocio() {
  return (
    <div className="mt-auto group">
      <Link
        to="/dashboard"
        className="
          /* Tipografía y Espaciado */
          text-2xl font-extrabold tracking-tight
          px-6 py-3 rounded-2xl inline-block
          transition-all duration-300 ease-in-out
          
          /* Estilo Base (Funciona en fondo blanco) */
          bg-zinc-900 text-white shadow-lg
          
          /* Estilo para Fondo Oscuro (Añade borde para resaltar) */
          border-2 border-transparent
          group-hover:border-purple-500/50
          
          /* Efectos Hover */
          hover:scale-105 hover:shadow-purple-500/20
          active:scale-95
        "
      >
        <span className="drop-shadow-md">Locu</span>
        <span className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">Ventas</span>
      </Link>
    </div>
  );
}

export default LogoNegocio;