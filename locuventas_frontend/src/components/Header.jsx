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
import VendedoresDropdown from "./common/VendedoresDropdown";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false); // ¿Menú móvil abierto?
  const [showHeader, setShowHeader] = useState(false); // Para animar la cabecera
  const [isGestionOpen, setIsGestionOpen] = useState(false); // ¿Dropdown “Gestión” abierto?
  const [isVendedoresOpen, setIsVendedoresOpen] = useState(false); // ¿Dropdown “Vendedores” abierto?
  const [isPendientesOpen, setIsPendientesOpen] = useState(false); // ¿Dropdown “Pendientes” abierto?
  const [isAvatarOpen, setIsAvatarOpen] = useState(false); // ¿Dropdown “Mi cuenta” abierto?
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false); // Modal de cerrar sesión

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  // Ref para el botón “Vendedores” dentro de GestionDropdown (si necesitas posicionar)
  const vendedoresLinkRef = useRef(null);

  const { nombre, foto, email, roles = [] } = auth || {};
  const esAdmin = roles.includes("ROLE_ADMIN");

  // Animación de entrada de la cabecera
  useEffect(() => {
    setTimeout(() => setShowHeader(true), 100);
  }, []);

  // Cerrar dropdowns si se hace clic fuera del header
  useEffect(() => {
    function handleClickOutside(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setIsGestionOpen(false);
        setIsVendedoresOpen(false);
        setIsPendientesOpen(false);
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

  // Estilo “neón” compartido para botones
  const neonButtonClass = `
    px-4 py-2 text-white font-semibold rounded-xl bg-zinc-900
    ring-2 ring-orange-400 shadow-[0_0_12px_2px_rgba(251,146,60,0.4)]
    hover:ring-purple-500 hover:shadow-[0_0_18px_4px_rgba(168,85,247,0.6)]
    transition-all duration-300
  `;

  // Al hacer clic en “Vendedores” dentro de GestionDropdown
  const handleClickVendedores = () => {
    if (!isGestionOpen) {
      // Si “Gestión” no estaba abierto, lo abrimos y también “Vendedores”
      setIsGestionOpen(true);
      setIsVendedoresOpen(true);
    } else {
      // Si “Gestión” ya estaba abierto, solo alternamos “Vendedores”
      setIsVendedoresOpen((prev) => !prev);
    }
    // Al abrir “Vendedores”, cerramos “Pendientes” y “Avatar”
    if (!isVendedoresOpen) {
      setIsPendientesOpen(false);
      setIsAvatarOpen(false);
    }
  };

  // Al hacer clic en “Pendientes de aprobar”
  const handlePendientes = () => {
    // Alterna solamente “Pendientes”; deja abierto “Vendedores” y “Gestión”
    setIsPendientesOpen((prev) => !prev);
  };

  // Al hacer clic en “Gestionar Vendedores”
  const handleGestionarVendedores = () => {
    // Redirige a la ruta correspondiente y cierra todos los dropdowns
    navigate("/vendedores/gestionar");
    setIsPendientesOpen(false);
    setIsVendedoresOpen(false);
    setIsGestionOpen(false);
    setIsAvatarOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className={`
        w-full fixed top-0 left-0 z-50
        transition-all duration-700 ease-out transform
        ${
          showHeader ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }
      `}
    >
      {/* ====== CABECERA PRINCIPAL ====== */}
      <div
        className="
        max-w-7xl mx-auto px-6 py-4 flex items-center justify-between
        rounded-b-2xl shadow-lg backdrop-blur-md
        bg-gradient-to-r from-blue-500 via-white to-purple-500/90
        border-b border-white/20
      "
      >
        {/* --- LOGO --- */}
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

        {/* --- NAVEGACIÓN DE ESCRITORIO (solo ADMIN) --- */}
        {esAdmin && (
          <nav className="hidden md:flex gap-6 items-center relative">
            {/* BOTÓN “Gestión” */}
            <button
              onClick={() => {
                setIsGestionOpen((prev) => {
                  if (prev) {
                    // Al cerrar “Gestión”, también cerrar “Vendedores” y “Pendientes”
                    setIsVendedoresOpen(false);
                    setIsPendientesOpen(false);
                  }
                  return !prev;
                });
                setIsAvatarOpen(false);
                setMenuOpen(false); // Si venía del menú móvil, cerrar ese menú
              }}
              className={neonButtonClass}
            >
              Gestión
            </button>

            <GestionDropdown
              isOpen={isGestionOpen}
              vendedoresLinkRef={vendedoresLinkRef}
              onClickVendedores={handleClickVendedores}
            >
              <VendedoresDropdown
                isOpen={isVendedoresOpen}
                onClickPendientes={handlePendientes}
                isPendientesOpen={isPendientesOpen}
                onClickGestionar={handleGestionarVendedores}
              />
            </GestionDropdown>

            {/* AVATAR “Mi cuenta” */}
            <AvatarUsuario
              foto={foto}
              nombre={nombre}
              email={email}
              isOpen={isAvatarOpen}
              onToggleDropdown={() => {
                setIsAvatarOpen((prev) => !prev);
                setIsGestionOpen(false);
                setIsVendedoresOpen(false);
                setIsPendientesOpen(false);
                setMenuOpen(false);
              }}
            />
          </nav>
        )}

        {/* --- BOTÓN MENÚ MÓVIL --- */}
        <button
          onClick={() => {
            setMenuOpen((prev) => !prev);
            setIsGestionOpen(false);
            setIsVendedoresOpen(false);
            setIsPendientesOpen(false);
            setIsAvatarOpen(false);
          }}
          className="md:hidden text-white hover:scale-110 transition-transform cursor-pointer"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ====== MENÚ MÓVIL ====== */}
      <div
        className={`
          md:hidden mx-4 mt-[2px] rounded-b-2xl bg-zinc-900/95 px-6 py-6 text-center shadow-lg
          border-t border-white/10 transform transition-all duration-500 ease-in-out origin-top overflow-hidden
          ${
            menuOpen
              ? "scale-y-100 opacity-100 max-h-96"
              : "scale-y-0 opacity-0 max-h-0"
          }
        `}
      >
        <div className="flex flex-col gap-4">
          {/* BOTÓN “Gestión” en móvil */}
          <button
            onClick={() => {
              setIsGestionOpen((prev) => !prev);
              setIsAvatarOpen(false);
              // No cerrar menuOpen aquí; solo alternamos el submenú
            }}
            className={neonButtonClass}
          >
            Gestión
          </button>

          {/* Opciones de “Gestión” en móvil */}
          {isGestionOpen && (
            <div className="space-y-2 px-2 mt-1">
              <Link to="/vendedores" onClick={() => setMenuOpen(false)}>
                <BotonClaro>Vendedores</BotonClaro>
              </Link>
              <Link to="/categorias" onClick={() => setMenuOpen(false)}>
                <BotonClaro>Categorías</BotonClaro>
              </Link>
              <Link to="/productos" onClick={() => setMenuOpen(false)}>
                <BotonClaro>Productos</BotonClaro>
              </Link>
            </div>
          )}

          {/* BOTÓN “Mi cuenta” en móvil */}
          <button
            onClick={() => {
              setIsAvatarOpen((prev) => !prev);
              setIsGestionOpen(false);
              setIsVendedoresOpen(false);
              setIsPendientesOpen(false);
            }}
            className={neonButtonClass}
          >
            Mi cuenta
          </button>

          {/* Submenú “Mi cuenta” en móvil */}
          {isAvatarOpen && (
            <div className="space-y-2 px-2 mt-1">
              <p className="text-sm text-gray-400">
                Usuario:{" "}
                <span className="text-white font-medium">{nombre}</span>
              </p>
              <p className="text-sm text-gray-400 mb-1">
                Correo: <span className="text-white font-medium">{email}</span>
              </p>
              <BotonClaro onClick={() => setMostrarConfirmacion(true)}>
                Cerrar sesión
              </BotonClaro>
            </div>
          )}
        </div>
      </div>

      {/* ====== MODAL DE CONFIRMACIÓN (Cerrar sesión) ====== */}
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
