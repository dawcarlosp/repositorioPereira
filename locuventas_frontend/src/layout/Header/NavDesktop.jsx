import React from "react";
import Boton from "@components/common/Boton";
import AvatarUsuario from "@components/vendedor/AvatarUsuario";
import GestionDropdown from "@components/common/GestionDropdown";
import VendedoresDropdown from "@components/vendedor/VendedoresDropdown";
import { toast } from "react-toastify";

export default function NavDesktop({ h, esAdmin, esVendedor }) {
  const { nombre, foto, email } = h.auth || {};

  // Clase para mantener el estilo neón unificado
  const neonButtonClass = `
    px-4 py-2 text-orange-400 font-bold rounded-xl bg-zinc-900/50
    border border-orange-500/30 transition-all duration-300
    hover:bg-orange-500 hover:text-white hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]
  `;

  return (
    <nav className="hidden md:flex gap-6 items-center relative">
      {esAdmin && (
        <div className="relative">
          <Boton
            onClick={() => h.setActiveDropdown(h.activeDropdown === 'gestion' ? null : 'gestion')}
            className={neonButtonClass}
          >
            Gestión
          </Boton>
          
          <GestionDropdown
            isOpen={h.activeDropdown === 'gestion'}
            onClickVendedores={() => h.setActiveDropdown('vendedores')}
          >
            <VendedoresDropdown
              isOpen={h.activeDropdown === 'vendedores'}
              onClickGestionar={() => {
                h.closeAll();
                toast.info("Navegando a gestión...");
              }}
              onConfirmacion={(config) => {
                // Aquí podrías manejar la lógica de confirmación global si fuera necesario
              }}
            />
          </GestionDropdown>
        </div>
      )}

      <AvatarUsuario
        foto={foto}
        nombre={nombre}
        email={email}
        isOpen={h.activeDropdown === 'avatar'}
        onToggleDropdown={() => h.setActiveDropdown(h.activeDropdown === 'avatar' ? null : 'avatar')}
        onEditarPerfil={() => {
          h.setModalEditar(true);
          h.setActiveDropdown(null);
        }}
        esVendedor={esVendedor && !esAdmin}
      />
    </nav>
  );
}