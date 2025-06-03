// src/components/common/Header.jsx
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AvatarUsuario from "../components/common/AvatarUsuario";
import { useAuth } from "../context/useAuth";

import ModalConfirmacion from "../components/common/ModalConfirmacion";
import BotonClaro from "../components/common/BotonClaro";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const { auth, setAuth } = useAuth();
  // auth.roles es un array de strings, p.ej: ["ROLE_USER"], ["ROLE_ADMIN", "ROLE_VENDEDOR"], etc.
  const roles = auth?.roles || [];
  const esAdmin = roles.includes("ROLE_ADMIN");

  const { nombre, foto, email } = auth || {};
  const navigate = useNavigate();

  const handleLogoutConfirmado = () => {
    setAuth({ token: null, nombre: null, foto: null, email: null, roles: [] });
    navigate("/");
  };

  useEffect(() => {
    // Pequeña animación para que el header aparezca con fade-in
    setTimeout(() => setShowHeader(true), 100);
  }, []);

  const neonButtonClass = `
    px-4 py-2 text-white font-semibold rounded-xl bg-zinc-900
    ring-2 ring-orange-400 shadow-[0_0_12px_2px_rgba(251,146,60,0.4)]
    hover:ring-purple-500 hover:shadow-[0_0_18px_4px_rgba(168,85,247,0.6)]
    transition-all duration-300
  `;

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-700 ease-out transform ${
        showHeader ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
      }`}
    >
      <div
        className="
          max-w-7xl mx-auto px-6 py-4 
          flex items-center justify-between
          rounded-b-2xl shadow-lg backdrop-blur-md
          bg-gradient-to-r from-blue-500 via-white to-purple-500/90
          border-b border-white/20
        "
      >
        {/* Logo */}
        <Link
          to="/"
          className="
            text-2xl font-extrabold text-white tracking-wide
            hover:scale-105 transition-transform duration-200
            drop-shadow-sm bg-zinc-900 p-2 rounded-xl
          "
        >
          Locu<span className="text-orange-400">Ventas</span>
        </Link>

        {/* Navegación escritorio */}
        <nav className="hidden md:flex gap-6 items-center">
          {/* Solo mostramos “Gestión” si el usuario es ADMIN */}
          {esAdmin && (
            <Link to="/" className={neonButtonClass}>
              Gestión
            </Link>
          )}
          <Link to="/dashboard" className={neonButtonClass}>
            Vendedores
          </Link>
          <AvatarUsuario foto={foto} nombre={nombre} email={email} />
        </nav>

        {/* Botón menú móvil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white hover:scale-110 transition-transform cursor-pointer"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Navegación móvil */}
      <div
        className={`
          md:hidden mx-4 mt-[2px] rounded-b-2xl bg-zinc-900/95 px-6 py-6 text-center
          shadow-lg border-t border-white/10
          transform transition-all duration-500 ease-in-out origin-top overflow-hidden
          ${menuOpen
            ? "scale-y-100 opacity-100 max-h-96 space-y-4"
            : "scale-y-0 opacity-0 max-h-0"}
        `}
      >
        <div className="flex flex-col gap-4">
          {/* Solo mostramos “Gestión” en móvil si es ADMIN */}
          {esAdmin && (
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={neonButtonClass}
            >
              Gestión
            </Link>
          )}
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className={neonButtonClass}
          >
            Dashboard
          </Link>
          <BotonClaro
            onClick={() => {
              setMenuOpen(false);
              setMostrarConfirmacion(true);
            }}
          >
            Cerrar sesión
          </BotonClaro>
        </div>
      </div>

      {/* Modal de confirmación */}
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
