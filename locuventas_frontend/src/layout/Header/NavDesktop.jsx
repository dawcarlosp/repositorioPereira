// src/layout/Header/NavDesktop.jsx
import React, { useRef } from "react";
import Boton from "@components/common/Boton";
import GestionDropdown from "@layout/Header/components/GestionDropdown";
import MenuUsuarioDropdown from "@components/vendedor/MenuUsuarioDropdown";
import AdminActions from "@layout/Header/components/AdminActions";
import BotonClaro from "@components/common/BotonClaro";
export default function NavDesktop({ h, esAdmin }) {
  const usuario = h.auth || {};
  const btnAdminRef = useRef(null);
  const isGestionOpen = h.activeDropdown === "gestion";

  return (
    <nav className="hidden md:flex gap-6 items-center relative">
      {esAdmin && (
        <div className="relative">
          {isGestionOpen ? (
            <Boton
              ref={btnAdminRef}
              disabled={true} // Se queda "marcado" y no reacciona a clicks mientras está abierto
              className="px-4 py-2 opacity-90 ring-1 ring-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            >
              Panel de Administrador
            </Boton>
          ) : (
            <BotonClaro
              ref={btnAdminRef}
              onClick={() => h.setActiveDropdown("gestion")}
              className="px-4 py-2 border-orange-500/30 text-orange-400"
            >
              Panel de Administrador
            </BotonClaro>
          )}

          <GestionDropdown isOpen={isGestionOpen} triggerRef={btnAdminRef}>
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