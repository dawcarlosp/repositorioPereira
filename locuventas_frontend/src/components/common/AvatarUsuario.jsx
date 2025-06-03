import { useState } from "react";
import defaultAvatar from "../../assets/default-avatar.png";
import Boton from "./Boton";
import BotonClaro from "./BotonClaro";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import ModalConfirmacion from "./ModalConfirmacion"; 
export default function AvatarUsuario({ foto, nombre }) {
  const [imgError, setImgError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL || "";
  const url = `${baseUrl}/imagenes/vendedores/${foto}`;
  const displayUrl = imgError || !foto ? defaultAvatar : url;

  const { auth, setAuth } = useAuth();
  const email = auth?.email || "correo@ejemplo.com";
  const navigate = useNavigate();

  const handleLogoutConfirmado = () => {
    setAuth({ token: null, nombre: null, foto: null, email: null });
    navigate("/");
  };

  const handleEdit = () => {
    alert("Editar perfil (función por implementar)");
  };

  return (
    <div className="relative flex items-center gap-4 z-50">
      {/* FOTO DEL USUARIO */}
      <div
        className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-orange-400 
          shadow-[0_0_12px_4px_rgba(251,146,60,0.4)] 
          hover:ring-purple-500 hover:shadow-[0_0_20px_6px_rgba(168,85,247,0.6)] 
          transition-all duration-500 cursor-pointer"
        onClick={() => setShowInfo((prev) => !prev)}
      >
        <img
          src={displayUrl}
          alt={`Foto de ${nombre || "usuario"}`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* PANEL DE INFO */}
      {showInfo && (
        <div className="absolute top-20 right-0 z-40 w-64 bg-zinc-900/90 backdrop-blur-md shadow-xl rounded-xl p-4">
          <div className="absolute -top-2 right-6 w-4 h-4 rotate-45 bg-zinc-900/90"></div>

          <p className="text-sm text-gray-400 mb-1">
            Usuario: <span className="text-white font-medium">{nombre}</span>
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Correo: <span className="text-white font-medium">{email}</span>
          </p>

          <div className="flex flex-col gap-2">
            <BotonClaro onClick={handleEdit}>Editar perfil</BotonClaro>
            <BotonClaro onClick={() => {
               setShowInfo(false);
              setMostrarConfirmacion(true);
              }}>
              Cerrar Sesión
            </BotonClaro>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN CON FONDO OSCURECIDO */}
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
