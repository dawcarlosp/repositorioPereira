import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { UseHeaderManagerReturn } from "@hooks/useHeaderManager";
import type { Auth } from "@/features/auth/domain/auth.types";
import Avatar from "@components/common/Avatar";
import BotonClaro from "@buttons/BotonClaro";
import DropdownContainer from "@components/common/DropdownContainer";
import useResponsiveLayout from "@hooks/useResponsiveLayout";
import { userMenuConfig } from "@layout/Header/config/userMenuConfig";

interface Props {
  h:                UseHeaderManagerReturn;
  usuario:          Partial<Auth>;
  isOpen:           boolean;
  onToggleDropdown: () => void;
  onOpenLogoutModal: () => void;
}

export default function MenuUsuarioDropdown({
  h,
  usuario,
  isOpen,
  onToggleDropdown,
}: Props) {
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLButtonElement>(null);
  const { isSmall } = useResponsiveLayout();

  const fotoUrl = usuario.foto
    ? `${import.meta.env.VITE_API_URL}/imagenes/${usuario.foto}`
    : null;

  const items = userMenuConfig(h);

  return (
    <div className="relative">
      <button
        ref={avatarRef}
        onClick={onToggleDropdown}
        className="focus:outline-none"
      >
        <Avatar
          src={fotoUrl}
          alt={usuario.nombre}
          className={
            isOpen
              ? "border-purple-500 scale-105 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
              : "border-purple-500/50 hover:border-purple-500"
          }
        />
      </button>

      <DropdownContainer
        isOpen={isOpen}
        triggerRef={avatarRef}
        side="top"
        className="top-full mt-3 right-0 z-50"
        width="w-64"
      >
        <div className="mb-4 pb-3 border-b border-zinc-800">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">
            Vendedor
          </p>
          <p className="text-white font-bold truncate">{usuario.nombre}</p>
          <p className="text-xs text-zinc-500 truncate">{usuario.email}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          {items.map((item) => (
            <BotonClaro
              key={item.label}
              className={`!justify-start !text-[11px] uppercase tracking-wider font-bold h-9 ${
                item.danger ? "hover:!text-rose-500" : ""
              }`}
              onClick={(e) => {
                if (item.route) {
                  onToggleDropdown();
                  navigate(item.route);
                } else {
                  item.action?.(e);
                }
              }}
            >
              {item.label}
            </BotonClaro>
          ))}
        </div>
      </DropdownContainer>
    </div>
  );
}
