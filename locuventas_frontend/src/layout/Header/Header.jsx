import React from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useHeaderManager from "@hooks/useHeaderManager";

// Sub-componentes que extraeremos
import NavDesktop from "@layout/Header/NavDesktop";
import NavMobile from "@layout/Header/NavMobile";
import ModalConfirmacion from "@components/common/ModalConfirmacion";
import FormEditarPerfil from "@components/vendedor/Form/FormEditarPerfil";

export default function Header() {
  const h = useHeaderManager();
  const { nombre, foto, email, roles = [] } = h.auth || {};
  const esAdmin = roles.includes("ROLE_ADMIN");
  const esVendedor = roles.includes("ROLE_VENDEDOR");

  return (
    <header ref={h.headerRef} className="w-full top-0 left-0 z-50 sticky">
      <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between rounded-b-2xl backdrop-blur-xl bg-zinc-900/90 border-b-2 border-orange-500/50 shadow-lg">
        
        {/*Contenedor de la animación*/}
      <div className="animated-border-container mt-auto rounded-t-2xl shadow-2xl">
        {/* LOGO */}
        <Link to="/dashboard" className="animated-border-inner text-2xl font-extrabold text-white bg-zinc-900 p-2 rounded-xl">
          Locu<span className="text-orange-400">Ventas</span>
        </Link>
        </div>

        {/* DESKTOP NAV */}
        <NavDesktop h={h} esAdmin={esAdmin} esVendedor={esVendedor} />

        {/* MOBILE TOGGLE */}
        <button onClick={() => h.setMenuOpen(!h.menuOpen)} className="md:hidden text-white">
          {h.menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE NAV */}
      <NavMobile h={h} esAdmin={esAdmin} esVendedor={esVendedor} />

      {/* MODALES GLOBALES */}
      {h.mostrarConfirmacionLogout && (
        <ModalConfirmacion
          mensaje="¿Estás seguro de cerrar sesión?"
          onConfirmar={h.handleLogout}
          onCancelar={() => h.setMostrarConfirmacionLogout(false)}
        />
      )}

      <FormEditarPerfil
        isOpen={h.modalEditar}
        setIsOpen={h.setModalEditar}
        usuario={{ nombre, email, foto }}
      />
    </header>
  );
}