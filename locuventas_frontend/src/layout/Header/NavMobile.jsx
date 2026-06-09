import React, { useRef, useEffect, useState } from "react";
import Boton from "@buttons/Boton";
import BotonClaro from "@buttons/BotonClaro";
import VentasNavMenu from "@components/ventas/VentasNavMenu";
import AdminActions from "@layout/Header/components/AdminActions";
import FormEditarPerfil from "@components/vendedor/Form/FormEditarPerfil";
//import ModalConfirmacion from "@components/common/ModalConfirmacion";
export default function NavMobile({ h, esAdmin }) {

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef(null);
  const { nombre, email, foto } = h.auth || {};

  // Custom scrollbar: muestra la barra solo mientras hay scroll activo
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsScrolling(false), 800);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <FormEditarPerfil
        isOpen={h.modalEditar}
        setIsOpen={h.setModalEditar}
        usuario={{ nombre, email, foto }}
      />

      {h.menuOpen && (
        <div className="md:hidden mx-4 mt-[2px] rounded-b-2xl bg-zinc-900/95 shadow-xl border-t border-white/10 animate-in fade-in zoom-in duration-300 flex flex-col overflow-hidden max-h-[75dvh]">
          {/* Zona scrollable con custom scrollbar */}
          <div
            ref={scrollRef}
            className={`
              custom-scrollbar ${isScrolling ? "scrolling" : ""}
              flex-1 overflow-y-auto overflow-x-hidden overscroll-contain
              px-6 py-6 flex flex-col gap-4
            `}
          >
            {/* NAVEGACIÓN */}
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[2px] ml-2">
                Navegación
              </p>
              <VentasNavMenu closeMenu={h.closeAll} />
            </div>

            {/* GESTIÓN ADMIN */}
            {esAdmin && (
              <div className="px-2 py-4 border-t border-zinc-800/50">
                <AdminActions h={h} />
              </div>
            )}

            {/* CUENTA */}
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
                  h.closeAll();
                }}
              >
                Cerrar Sesión
              </Boton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
