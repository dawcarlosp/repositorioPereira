import React from "react";

function LogoNegocio() {
  return (
    <Link
      to="/dashboard"
      className="
            text-2xl font-extrabold text-white tracking-wide hover:scale-105
            transition-transform duration-200 drop-shadow-sm
            bg-zinc-900 p-2 rounded-xl
          "
    >
      Locu<span className="text-purple-400">Ventas</span>
    </Link>
  );
}

export default LogoNegocio;
