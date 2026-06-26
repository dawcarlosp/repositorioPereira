import { useRef, useEffect, useState } from "react";
import type { UseHeaderManagerReturn } from "@hooks/useHeaderManager";
import type { Auth } from "@/features/auth/domain/auth.types";
import Boton from "@buttons/Boton";
import BotonClaro from "@buttons/BotonClaro";
import MenuVentas from "@components/ventas/MenuVentas";
import AdminMenu from "@layout/Header/components/AdminMenu";

interface Props {
  h:           UseHeaderManagerReturn;
  esAdmin:     boolean;
  esVendedor?: boolean;
  usuario:     Partial<Auth>;
}

export default function NavMobile({ h, esAdmin, usuario }: Props) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { nombre, email } = usuario;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout>;
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

      {h.menuOpen && (
        <div className="md:hidden mx-4 mt-[2px] rounded-b-2xl bg-zinc-900/95 shadow-xl border-t border-white/10 animate-in fade-in zoom-in duration-300 flex flex-col overflow-hidden max-h-[75dvh]">
          <div
            ref={scrollRef}
            className={`
              custom-scrollbar ${isScrolling ? "scrolling" : ""}
              flex-1 overflow-y-auto overflow-x-hidden overscroll-contain
              px-6 py-6 flex flex-col gap-4
            `}
          >
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[2px] ml-2">
                Navegación
              </p>
              <MenuVentas closeMenu={h.closeAll} />
            </div>

            {esAdmin && (
              <div className="px-2 py-4 border-t border-zinc-800/50">
                <AdminMenu h={h} showTitle />
              </div>
            )}

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

              <BotonClaro
                className="w-full bg-rose-500/10 text-rose-500 border-rose-500/20 hover:text-rose-500"
                onClick={() => {
                  h.setMostrarConfirmacionLogout(true);
                  h.closeAll();
                }}
              >
                Cerrar Sesión
              </BotonClaro>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
