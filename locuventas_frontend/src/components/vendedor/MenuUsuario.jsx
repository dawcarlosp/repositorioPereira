// src/components/vendedor/MenuUsuario.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@context/useAuth";
import Avatar from "@components/common/Avatar";
import BotonClaro from "@components/common/BotonClaro";
import ModalConfirmacion from "@components/common/ModalConfirmacion";
import FormEditarPerfil from "@components/vendedor/Form/FormEditarPerfil";

export default function MenuUsuario({ usuario, isOpen, onToggleDropdown }) {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ token: null, nombre: null, foto: null, email: null, roles: [] });
    navigate("/");
  };

  // Construimos la URL de la imagen aquí para no ensuciar el componente visual Avatar
  const fotoUrl = usuario.foto 
    ? `${import.meta.env.VITE_API_URL}/imagenes/vendedores/${usuario.foto}` 
    : null;

  return (
    <div className="relative">
      {/* Gatillo: Usamos el componente Avatar */}
      <button onClick={onToggleDropdown} className="focus:outline-none">
        <Avatar 
          src={fotoUrl} 
          alt={usuario.nombre} 
          className={isOpen ? 'border-purple-500 scale-105 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'border-purple-500/50 hover:border-zinc-500'}
        />
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div className="absolute top-full mt-3 right-0 z-[100] w-64 bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="absolute -top-1.5 right-4 w-3 h-3 rotate-45 bg-zinc-900 border-t border-l border-zinc-800"></div>

          <div className="mb-4 pb-3 border-b border-zinc-800">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Vendedor</p>
            <p className="text-white font-bold truncate">{usuario.nombre}</p>
            <p className="text-xs text-zinc-500 truncate">{usuario.email}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <BotonClaro onClick={() => { setModalEditar(true); onToggleDropdown(); }} className="!justify-start !text-[11px] uppercase tracking-wider font-bold h-9">
              👤 Editar Perfil
            </BotonClaro>
            <Link to="/aboutme" onClick={onToggleDropdown}>
              <BotonClaro className="w-full !justify-start !text-[11px] uppercase tracking-wider font-bold h-9">
                🚀 Developer Info
              </BotonClaro>
            </Link>
            <BotonClaro onClick={() => { setMostrarConfirmacion(true); onToggleDropdown(); }} className="!justify-start !text-[11px] uppercase tracking-wider font-bold h-9 hover:!text-rose-500">
              🚪 Cerrar Sesión
            </BotonClaro>
          </div>
        </div>
      )}

      {/* Modales fuera del flujo */}
      <FormEditarPerfil isOpen={modalEditar} setIsOpen={setModalEditar} usuario={usuario} />
      {mostrarConfirmacion && (
        <ModalConfirmacion
          mensaje="¿Deseas finalizar tu sesión de trabajo?"
          onConfirmar={handleLogout}
          onCancelar={() => setMostrarConfirmacion(false)}
        />
      )}
    </div>
  );
}