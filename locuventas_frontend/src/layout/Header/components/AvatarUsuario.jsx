// src/components/vendedor/AvatarUsuario.jsx
import { useState } from "react";
import defaultAvatar from "@/assets/default-avatar.png";
import BotonClaro from "@components/common/BotonClaro";
import ModalConfirmacion from "@components/common/ModalConfirmacion";
import { useAuth } from "@context/useAuth";
import { useNavigate } from "react-router-dom";
import FormEditarPerfil from "@components/vendedor/Form/FormEditarPerfil";
import { Link} from "react-router-dom";
export default function AvatarUsuario({
  foto,
  nombre,
  email,
  isOpen, // Si el dropdown está abierto
  onToggleDropdown, // Función para alternar el dropdown
}) {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [modalEditar, setModalEditar] = useState(false);
  const handleLogoutConfirmado = () => {
    setAuth({ token: null, nombre: null, foto: null, email: null, roles: [] });
    navigate("/");
  };

  const displayUrl = foto
    ? `${import.meta.env.VITE_API_URL}/imagenes/vendedores/${foto}`
    : defaultAvatar;

  return (
    <div className="relative flex items-center">
      {/* FOTO clicable */}
      <div
        className={`
          relative w-12 h-12 rounded-full overflow-hidden ring-4 ring-orange-400
          shadow-[0_0_12px_4px_rgba(251,146,60,0.4)]
          hover:ring-purple-500 hover:shadow-[0_0_20px_6px_rgba(168,85,247,0.6)]
          transition-all duration-300 cursor-pointer
        `}
        onClick={onToggleDropdown}
      >
        <img
          src={displayUrl}
          alt={`Avatar de ${nombre || "usuario"}`}
          onError={(e) => (e.currentTarget.src = defaultAvatar)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* PANEL “Mi cuenta” */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-50 w-60 bg-zinc-900/90 backdrop-blur-md shadow-xl rounded-xl p-4">
          <div className="absolute -top-2 right-6 w-4 h-4 rotate-45 bg-zinc-900/90"></div>

          <p className="text-sm text-gray-400 mb-1">
            Usuario: <span className="text-white font-medium">{nombre}</span>
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Correo: <span className="text-white font-medium">{email}</span>
          </p>

          <div className="flex flex-col gap-2">
            <BotonClaro o onClick={() => setModalEditar(true)}>
              Editar perfil
            </BotonClaro>
            <FormEditarPerfil
              isOpen={modalEditar}
              setIsOpen={setModalEditar}
              usuario={{ nombre, email, foto }} // los datos actuales del usuario
            />

            <BotonClaro onClick={() => setMostrarConfirmacion(true)}>
              Cerrar sesión
            </BotonClaro>
            <Link to={"/aboutme"}>
              <BotonClaro>{"Perfil del desarrollador"}</BotonClaro>
            </Link>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {mostrarConfirmacion && (
        <ModalConfirmacion
          mensaje="¿Estás seguro de cerrar sesión?"
          onConfirmar={handleLogoutConfirmado}
          onCancelar={() => setMostrarConfirmacion(false)}
        />
      )}
    </div>
  );
}
