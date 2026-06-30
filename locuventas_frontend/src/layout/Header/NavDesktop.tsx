import { useRef } from "react";
import type { UseHeaderManagerReturn } from "@hooks/useHeaderManager";
import Button from "@buttons/Button";
import GestionDropdown from "@layout/Header/components/GestionDropdown";
import MenuUsuarioDropdown from "@layout/Header/components/MenuUsuarioDropdown";

interface Props {
  h:         UseHeaderManagerReturn;
  esAdmin:   boolean;
  esVendedor?: boolean;
}

export default function NavDesktop({ h, esAdmin }: Props) {
  const usuario = h.auth || {};
  const btnAdminRef = useRef<HTMLButtonElement>(null);
  const isGestionOpen = h.activeDropdown === "gestion";

  return (
    <nav className="hidden md:flex gap-6 items-center relative">
      {esAdmin && (
        <div className="relative">
          {isGestionOpen ? (
            <Button
              ref={btnAdminRef}
              disabled={true}
              className="px-4 py-2 opacity-90 ring-1 ring-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            >
              Panel de Administrador
            </Button>
          ) : (
            <Button
              variant="secondary"
              ref={btnAdminRef}
              onClick={() => h.setActiveDropdown("gestion")}
              className="px-4 py-2 border-orange-500/30 text-orange-400"
            >
              Panel de Administrador
            </Button>
          )}

          <GestionDropdown isOpen={isGestionOpen} triggerRef={btnAdminRef} h={h} />
        </div>
      )}

      <MenuUsuarioDropdown
        h={h}
        usuario={usuario}
        isOpen={h.activeDropdown === "avatar"}
        onToggleDropdown={() =>
          h.setActiveDropdown(h.activeDropdown === "avatar" ? null : "avatar")
        }
        onOpenLogoutModal={() => {
          h.setMostrarConfirmacionLogout(true);
          setTimeout(() => { h.closeAll(); }, 0);
        }}
      />
    </nav>
  );
}
