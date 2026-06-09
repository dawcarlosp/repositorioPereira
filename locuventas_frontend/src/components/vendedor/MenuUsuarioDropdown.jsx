// src/components/vendedor/MenuUsuario.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@components/common/Avatar";
import BotonClaro from "@buttons/BotonClaro";
import ModalConfirmacion from "@components/common/ModalConfirmacion";
import DropdownContainer from "@components/common/DropdownContainer";

export default function MenuUsuarioDropdown({
  h,
  usuario,
  isOpen,
  onToggleDropdown,
  onOpenLogoutModal,
}) {
  const [modalEditar, setModalEditar] = useState(false);

  const fotoUrl = usuario.foto
    ? `${import.meta.env.VITE_API_URL}/imagenes/vendedores/${usuario.foto}`
    : null;

  return (
    <div className="relative">
      {/* Gatillo */}
      <button onClick={onToggleDropdown} className="focus:outline-none">
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

      {/* Menú Desplegable Reutilizable */}
      <DropdownContainer
        isOpen={isOpen}
        side="top"
        /* Anclaje milimétrico:
     Como el dropdown mide 256px (w-64) y está pegado a la derecha,
     necesitamos que la flecha esté casi al final.
     'calc(100% - 24px)' suele ser el centro exacto para un Avatar estándar.
  */
        arrowOffset="calc(100% - 24px)"
        className="absolute top-full mt-3 right-0"
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
          <BotonClaro
            onClick={() => {
              setModalEditar(true);
              onToggleDropdown();
            }}
            className="!justify-start !text-[11px] uppercase tracking-wider font-bold h-9"
             onClick={() => {
                  h.setModalEditar(true);
                  h.closeAll();
                }}
          >
            Editar Perfil
          </BotonClaro>

          <Link to="/aboutme" onClick={onToggleDropdown}>
            <BotonClaro className="w-full !justify-start !text-[11px] uppercase tracking-wider font-bold h-9">
              Developer Info
            </BotonClaro>
          </Link>

          <BotonClaro
            onClick={(e) => {
              e.stopPropagation(); // 👈 EVITA QUE EL CLICKOUTSIDE DETECTE ESTE CLIC
              onOpenLogoutModal();
            }}
            className="!justify-start !text-[11px] uppercase tracking-wider font-bold h-9 hover:!text-rose-500"
          >
            Cerrar Sesión
          </BotonClaro>
        </div>
      </DropdownContainer>
    </div>
  );
}
