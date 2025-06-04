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
  const [menuOpen, setMenuOpen] = useState(false);             // ¿Está abierto el menú móvil completo?
  const [showHeader, setShowHeader] = useState(false);         // Para animar la cabecera al aparecer
  const [isGestionOpen, setIsGestionOpen] = useState(false);   // ¿Sub‐dropdown “Gestión” abierto?
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);     // ¿Dropdown “Mi cuenta” abierto?
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false); // Modal de cerrar sesión

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  const { nombre, foto, email, roles = [] } = auth || {};
  const esAdmin = roles.includes("ROLE_ADMIN");

  // Animación inicial de la cabecera
  useEffect(() => {
    setTimeout(() => setShowHeader(true), 100);
  }, []);

  // Si se hace clic fuera de *cualquier* dropdown, cerramos todo
  useEffect(() => {
    function handleClickOutside(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setIsGestionOpen(false);
        setIsAvatarOpen(false);
        // *NO* cerrar menuOpen aquí: si estoy en móvil y quiero dejar el menú abierto, 
        // puedo tocar dentro del nav para cerrar solo sub‐desplegables.
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
      {/* ====== CABECERA PRINCIPAL ====== */}
      <div className="
        max-w-7xl mx-auto px-6 py-4 flex items-center justify-between
        rounded-b-2xl shadow-lg backdrop-blur-md
        bg-gradient-to-r from-blue-500 via-white to-purple-500/90
        border-b border-white/20
      ">
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

        {/* --- NAVEGACIÓN ESCRITORIO (solo admin) --- */}
        {esAdmin && (
          <nav className="hidden md:flex gap-6 items-center relative">
            {/* BOTÓN “Gestión” */}
            <button
              onClick={() => {
                setIsGestionOpen(prev => !prev);
                setIsAvatarOpen(false);
                setMenuOpen(false); // Si en móvil abrí gestión, al cambiar de vista se cierra menú principal
              }}
              className={neonButtonClass}
            >
              Gestión
            </button>

            {/* SUB‐DROPDOWN “Gestión” */}
            <GestionDropdown isOpen={isGestionOpen} />

            {/* AVATAR “Mi cuenta” */}
            <AvatarUsuario
              foto={foto}
              nombre={nombre}
              email={email}
              isOpen={isAvatarOpen}
              onToggleDropdown={() => {
                setIsAvatarOpen(prev => !prev);
                setIsGestionOpen(false);
                setMenuOpen(false);
              }}
            />
          </nav>
        )}

        {/* --- BOTÓN MENÚ MÓVIL --- */}
        <button
          onClick={() => {
            setMenuOpen(prev => !prev);
            setIsGestionOpen(false);
            setIsAvatarOpen(false);
          }}
          className="md:hidden text-white hover:scale-110 transition-transform cursor-pointer"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ====== MENÚ MÓVIL ====== */}
      {/** 
       * Cuando `menuOpen` = true, mostramos el bloque entero. 
       * Dentro, habrá botones que abren “Gestión” o “Mi cuenta” 
       * sin cerrar por completo el menú principal hasta que el usuario lo toque de nuevo.
       **/}
      <div
        className={`
          md:hidden mx-4 mt-[2px] rounded-b-2xl bg-zinc-900/95 px-6 py-6 text-center shadow-lg
          border-t border-white/10 transform transition-all duration-500 ease-in-out origin-top overflow-hidden
          ${menuOpen ? "scale-y-100 opacity-100 max-h-96" : "scale-y-0 opacity-0 max-h-0"}
        `}
      >
        <div className="flex flex-col gap-4">
          {/* --- BOTÓN “Gestión” --- */}
          <button
            onClick={() => {
              setIsGestionOpen(prev => !prev);
              setIsAvatarOpen(false);
              // *NO* cerramos `menuOpen` aquí. Queremos que el menú principal siga visible.
            }}
            className={neonButtonClass}
          >
            Gestión
          </button>

          {/* Si `isGestionOpen` = true mostramos las opciones */}
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

          {/* --- BOTÓN “Mi cuenta (Cerrar sesión)” --- */}
          <button
            onClick={() => {
              setIsAvatarOpen(prev => !prev);
              setIsGestionOpen(false);
            }}
            className={neonButtonClass}
          >
            Mi cuenta
          </button>

          {/* Si `isAvatarOpen` = true mostramos la mini‐info y botón de cerrar sesión */}
          {isAvatarOpen && (
            <div className="space-y-2 px-2 mt-1">
              <p className="text-sm text-gray-400">
                Usuario: <span className="text-white font-medium">{nombre}</span>
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

      {/* ====== MODAL DE CONFIRMACIÓN (CERRAR SESIÓN) ====== */}
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
