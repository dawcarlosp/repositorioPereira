// src/layout/Header/NavDesktop.jsx
import React from "react";
import Boton from "@components/common/Boton";
import GestionDropdown from "@layout/Header/components/GestionDropdown";
import VendedoresDropdown from "@layout/Header/components/VendedoresDropdown";
import MenuUsuarioDropdown from "@components/vendedor/MenuUsuarioDropdown";


export default function NavDesktop({ h, esAdmin, esVendedor }) {
  // Simplificamos la extracción: pasamos el objeto auth completo como "usuario"
  const usuario = h.auth || {};

  // Clase para botones con estética de sistema POS moderno
  const neonButtonClass = (active) => `
    px-4 py-2 font-bold rounded-xl transition-all duration-300 border
    ${
      active
        ? "bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
        : "text-orange-400 bg-zinc-900/50 border-orange-500/30 hover:bg-orange-500 hover:text-white"
    }
  `;

  // Lógica para saber si el bloque de gestión está activo
  const isGestionOpen = h.activeDropdown === "gestion" || h.activeDropdown === "vendedores";

  return (
    <nav className="hidden md:flex gap-6 items-center relative">
      
      {/* SECCIÓN GESTIÓN (ADMIN) */}
      {esAdmin && (
        <div className="relative">
          <Boton
            onClick={() => h.setActiveDropdown(isGestionOpen ? null : "gestion")}
            className={neonButtonClass(isGestionOpen)}
          >
            Gestión
          </Boton>

          <GestionDropdown
            isOpen={isGestionOpen}
            onClickVendedores={() =>
              h.setActiveDropdown(
                h.activeDropdown === "vendedores" ? "gestion" : "vendedores"
              )
            }
          >
            <VendedoresDropdown
              isOpen={h.activeDropdown === "vendedores"}
              isPendientesOpen={h.isPendientesOpen} 
              onClickPendientes={() => {
                if (typeof h.setIsPendientesOpen === "function") {
                  h.setIsPendientesOpen(!h.isPendientesOpen);
                }
              }}
              closeAll={h.closeAll}
              onConfirmacion={h.abrirConfirmacionGlobal}
            />
          </GestionDropdown>
        </div>
      )}

      {/* SECCIÓN PERFIL DE USUARIO */}
      <MenuUsuarioDropdown
        usuario={usuario} // Pasamos el objeto limpio
        isOpen={h.activeDropdown === "avatar"}
        onToggleDropdown={() =>
          h.setActiveDropdown(h.activeDropdown === "avatar" ? null : "avatar")
        }
      />
      
    </nav>
  );
}