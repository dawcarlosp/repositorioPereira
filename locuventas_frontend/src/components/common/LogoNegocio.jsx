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
          
          /* Estilo Base: Zinc-900 es clave para el contraste */
          /* En fondo blanco resalta por oscuridad, en fondo negro resalta por el borde */
          bg-zinc-900 text-white
          
          /* Borde Permanente: La clave de la versatilidad */
          /* Usamos una opacidad media para que en fondo negro se note el límite del botón */
          border-2 border-purple-500/30
          
          /* Sombra: En fondo blanco da profundidad, en fondo negro da brillo (glow) */
          shadow-lg shadow-purple-500/20
          
          /* Efectos Hover */
          group-hover:border-purple-500/60
          group-hover:shadow-purple-500/40
          hover:scale-105
          active:scale-95
        "
      >
        <span className="text-zinc-100 drop-shadow-md">Locu</span>
        <span className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
          Ventas
        </span>
      </Link>
    </div>
  );
}

export default LogoNegocio;