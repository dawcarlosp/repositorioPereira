import React from "react";
import Boton from "@components/common/Boton";
import AvatarUsuario from "@layout/Header/components/AvatarUsuario";
import GestionDropdown from "@layout/Header/components/GestionDropdown";
import VendedoresDropdown from "@layout/Header/components/VendedoresDropdown";

export default function NavDesktop({ h, esAdmin, esVendedor }) {
  const { nombre, foto, email } = h.auth || {};

  const neonButtonClass = (active) => `
    px-4 py-2 font-bold rounded-xl transition-all duration-300 border
    ${
      active
        ? "bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
        : "text-orange-400 bg-zinc-900/50 border-orange-500/30 hover:bg-orange-500 hover:text-white"
    }
  `;

  const isGestionOpen =
    h.activeDropdown === "gestion" || h.activeDropdown === "vendedores";

  return (
    <nav className="hidden md:flex gap-6 items-center relative">
      {esAdmin && (
        <div className="relative">
          <Boton
            onClick={() =>
              h.setActiveDropdown(isGestionOpen ? null : "gestion")
            }
            className={neonButtonClass(isGestionOpen)}
          >
            Gestión
          </Boton>

          <GestionDropdown
            isOpen={isGestionOpen}
            onClickVendedores={() =>
              h.setActiveDropdown(
                h.activeDropdown === "vendedores" ? "gestion" : "vendedores",
              )
            }
          >
            <VendedoresDropdown
              isOpen={h.activeDropdown === "vendedores"}
              isPendientesOpen={h.isPendientesOpen} 
              onClickPendientes={() => {
                if (typeof h.setIsPendientesOpen === "function") {
                  h.setIsPendientesOpen(!h.isPendientesOpen);
                } else {
                  console.error(
                    "Error: h.setIsPendientesOpen no está definida en el hook",
                  );
                }
              }}
              closeAll={h.closeAll}
              onConfirmacion={h.abrirConfirmacionGlobal}
            />
          </GestionDropdown>
        </div>
      )}

      <AvatarUsuario
        foto={foto}
        nombre={nombre}
        email={email}
        isOpen={h.activeDropdown === "avatar"}
        onToggleDropdown={() =>
          h.setActiveDropdown(h.activeDropdown === "avatar" ? null : "avatar")
        }
        onEditarPerfil={() => {
          h.setModalEditar(true);
          h.setActiveDropdown(null);
        }}
        esVendedor={esVendedor && !esAdmin}
      />
    </nav>
  );
}
