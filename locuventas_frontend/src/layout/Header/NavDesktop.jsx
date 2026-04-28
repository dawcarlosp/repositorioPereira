// src/layout/Header/NavDesktop.jsx
import React from "react";
import Boton from "@components/common/Boton";
import GestionDropdown from "@layout/Header/components/GestionDropdown";
import MenuUsuarioDropdown from "@components/vendedor/MenuUsuarioDropdown";
import AdminActions from "@layout/Header/components/AdminActions";

export default function NavDesktop({ h, esAdmin }) {
  const usuario = h.auth || {};

  const neonButtonClass = (active) => `
    px-4 py-2 font-bold rounded-xl transition-all duration-300 border
    ${active 
      ? "bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]" 
      : "text-orange-400 bg-zinc-900/50 border-orange-500/30 hover:text-white"}
  `;

  const isGestionOpen = h.activeDropdown === "gestion";

  return (
    <nav className="hidden md:flex gap-6 items-center relative">
      {esAdmin && (
        <div className="relative">
          <Boton
            onClick={() => h.setActiveDropdown(isGestionOpen ? null : "gestion")}
            className={neonButtonClass(isGestionOpen)}
          >
            Panel de Administrador
          </Boton>

          <GestionDropdown isOpen={isGestionOpen}>
            <AdminActions h={h} />
          </GestionDropdown>
        </div>
      )}

      <MenuUsuarioDropdown
        usuario={usuario}
        isOpen={h.activeDropdown === "avatar"}
        onToggleDropdown={() => h.setActiveDropdown(h.activeDropdown === "avatar" ? null : "avatar")}
      />
    </nav>
  );
}