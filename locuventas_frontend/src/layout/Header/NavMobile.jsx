import React from "react";
import { Link } from "react-router-dom";
import Boton from "@components/common/Boton";
import BotonClaro from "@components/common/BotonClaro";
import VentasNavMenu from "@components/ventas/VentasNavMenu";
import { toast } from "react-toastify";
import AdminActions from "@layout/Header/components/AdminActions";
export default function NavMobile({ h, esAdmin, esVendedor }) {
  if (!h.menuOpen) return null;

  const { nombre, email } = h.auth || {};

  return (
    <div className="md:hidden mx-4 mt-[2px] rounded-b-2xl bg-zinc-900/95 px-6 py-6 shadow-xl border-t border-white/10 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col gap-4">
      
      <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[2px] ml-2">Navegación</p>
          <VentasNavMenu closeMenu = {h.closeAll}/>
        </div>
        

        {/* SECCIÓN GESTIÓN (ADMIN) */}
        {esAdmin && (
          <div className="px-2 py-4 border-t border-zinc-800/50 mt-2">
            {/* Pasamos isSmall={true} para que AdminActions sepa que debe expandirse */}
            <AdminActions h={h} />
          </div>
        )}

        {/* SECCIÓN CUENTA */}
        <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-left ml-2">
            Mi Cuenta
          </p>
          <div className="bg-zinc-800/50 p-3 rounded-xl text-left mb-2">
            <p className="text-white font-medium text-sm">{nombre}</p>
            <p className="text-zinc-500 text-xs">{email}</p>
          </div>

          <BotonClaro
            onClick={() => {
              h.setModalEditar(true);
              h.closeAll();
            }}
          >
            Editar Perfil
          </BotonClaro>

          <Boton
            className="w-full bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white"
            onClick={() => {
              h.setMostrarConfirmacionLogout(true);
              h.setMenuOpen(false);
            }}
          >
            Cerrar Sesión
          </Boton>
        </div>
      </div>
    </div>
  );
}
