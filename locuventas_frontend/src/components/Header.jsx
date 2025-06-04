// src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import BotonClaro from "./common/BotonClaro";
import Boton from "./common/Boton";
import ModalConfirmacion from "./common/ModalConfirmacion";
import AvatarUsuario from "./common/AvatarUsuario";
import GestionDropdown from "./common/GestionDropdown";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);

  // Controlamos dos dropdowns distintos:
  const [isGestionOpen, setIsGestionOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  const { nombre, foto, email, roles = [] } = auth || {};
  const esAdmin = roles.includes("ROLE_ADMIN");

  useEffect(() => {
    setTimeout(() => setShowHeader(true), 100);
  }, []);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setIsGestionOpen(false);
        setIsAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutConfirmado = () => {
    setAuth({ token: null, nombre: null, foto: null, email: null, roles: [] });
    navigate("/");
  };

  const neonButtonClass = `
    px-4 py-2 text-white font-semibold rounded-xl bg-zinc-900
    ring-2 ring-orange-400 shadow-[0_0_12px_2px_rgba(251,146,60,0.4)]
    hover:ring-purple-500 hover:shadow-[0_0_18px_4px_rgba(168,85,247,0.6)]
    transition-all duration-300
  `;

  return (
    <header
      ref={headerRef}
      className={`
        w-full fixed top-0 left-0 z-50
        transition-all duration-700 ease-out transform
        ${showHeader ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}
      `}
    >
      <div className="
        max-w-7xl mx-auto px-6 py-4 flex items-center justify-between
        rounded-b-2xl shadow-lg backdrop-blur-md
        bg-gradient-to-r from-blue-500 via-white to-purple-500/90
        border-b border-white/20
      ">
        {/* Logo */}
        <Link
          to="/"
          className="
            text-2xl font-extrabold text-white tracking-wide hover:scale-105
            transition-transform duration-200 drop-shadow-sm
            bg-zinc-900 p-2 rounded-xl
          "
        >
          Locu<span className="text-orange-400">Ventas</span>
        </Link>

        {/** Si el usuario es ADMIN, mostramos el nav de escritorio; si no, no */}
        {esAdmin && (
          <nav className="hidden md:flex gap-6 items-center relative">
            {/** Botón Gestión */}
            <button
              onClick={() => {
                setIsGestionOpen((prev) => !prev);
                setIsAvatarOpen(false);
              }}
              className={neonButtonClass}
            >
              Gestión
            </button>

            {/** Dropdown de Gestión */}
            <GestionDropdown isOpen={isGestionOpen} />

            {/** AvatarUsuario */}
            <AvatarUsuario
              foto={foto}
              nombre={nombre}
              email={email}
              isOpen={isAvatarOpen}
              onToggleDropdown={() => {
                setIsAvatarOpen((prev) => !prev);
                setIsGestionOpen(false);
              }}
            />
          </nav>
        )}

        {/** Botón menú móvil */}
        <button
          onClick={() => {
            setMenuOpen((prev) => !prev);
            setIsGestionOpen(false);
            setIsAvatarOpen(false);
          }}
          className="md:hidden text-white hover:scale-110 transition-transform cursor-pointer"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/** Menú móvil (solo para ADMIN) */}
      <div
        className={`
          md:hidden mx-4 mt-[2px] rounded-b-2xl bg-zinc-900/95 px-6 py-6 text-center shadow-lg
          border-t border-white/10 transform transition-all duration-500 ease-in-out origin-top overflow-hidden
          ${menuOpen ? "scale-y-100 opacity-100 max-h-96 space-y-4" : "scale-y-0 opacity-0 max-h-0"}
        `}
      >
        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              setIsGestionOpen((prev) => !prev);
              setIsAvatarOpen(false);
              setMenuOpen(false);
            }}
            className={neonButtonClass}
          >
            Gestión
          </button>

          {isGestionOpen && (
            <div className="space-y-2 px-2">
              <Link to="/vendedores" className="block">
                <BotonClaro>Vendedores</BotonClaro>
              </Link>
              <Link to="/categorias" className="block">
                <BotonClaro>Categorías</BotonClaro>
              </Link>
              <Link to="/productos" className="block">
                <BotonClaro>Productos</BotonClaro>
              </Link>
            </div>
          )}

          <button
            onClick={() => {
              setIsAvatarOpen((prev) => !prev);
              setIsGestionOpen(false);
              setMenuOpen(false);
            }}
            className={neonButtonClass}
          >
            Mi cuenta
          </button>

          {isAvatarOpen && (
            <div className="space-y-2 px-2 mt-2">
              <p className="text-sm text-gray-400">
                Usuario: <span className="text-white font-medium">{nombre}</span>
              </p>
              <p className="text-sm text-gray-400">
                Correo: <span className="text-white font-medium">{email}</span>
              </p>
              <BotonClaro onClick={() => setMostrarConfirmacion(true)}>
                Cerrar sesión
              </BotonClaro>
            </div>
          )}
        </div>
      </div>

      {/** Modal de Confirmación (para cerrar sesión) */}
      {mostrarConfirmacion && (
        <ModalConfirmacion
          mensaje="¿Estás seguro de cerrar sesión?"
          onConfirmar={handleLogoutConfirmado}
          onCancelar={() => setMostrarConfirmacion(false)}
        />
      )}
    </header>
  );
}
