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
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [isGestionOpen, setIsGestionOpen] = useState(false);
  const [isVendedoresOpen, setIsVendedoresOpen] = useState(false);
  const [isPendientesOpen, setIsPendientesOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Submenú Vendedores móvil
  const [isVendedoresMobileOpen, setIsVendedoresMobileOpen] = useState(false);

  // MODAL GLOBAL para confirmación (Aprobar/Eliminar usuarios)
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    mensaje: "",
    confirmText: "",
    onConfirmar: null,
  });

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  // Ref para el botón “Vendedores” dentro de GestionDropdown
  const vendedoresLinkRef = useRef(null);

  const { nombre, foto, email, roles = [] } = auth || {};
  const esAdmin = roles.includes("ROLE_ADMIN");

  useEffect(() => {
    setTimeout(() => setShowHeader(true), 100);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setIsGestionOpen(false);
        setIsVendedoresOpen(false);
        setIsPendientesOpen(false);
        setIsAvatarOpen(false);
        setIsVendedoresMobileOpen(false);
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

  const handleClickVendedores = () => {
    if (!isGestionOpen) {
      setIsGestionOpen(true);
      setIsVendedoresOpen(true);
    } else {
      setIsVendedoresOpen((prev) => !prev);
    }
    if (!isVendedoresOpen) {
      setIsPendientesOpen(false);
      setIsAvatarOpen(false);
    }
  };

  const handlePendientes = () => {
    setIsPendientesOpen((prev) => !prev);
  };

  const handleGestionarVendedores = () => {
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
        ${showHeader ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}
      `}
    >
      <div
        className="
        max-w-7xl mx-auto px-6 py-4 flex items-center justify-between
        rounded-b-2xl shadow-lg backdrop-blur-md
        bg-gradient-to-r from-blue-500 via-white to-purple-500/90
        border-b border-white/20
      "
      >
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

        {esAdmin && (
          <nav className="hidden md:flex gap-6 items-center relative">
            <button
              onClick={() => {
                setIsGestionOpen((prev) => {
                  if (prev) {
                    setIsVendedoresOpen(false);
                    setIsPendientesOpen(false);
                  }
                  return !prev;
                });
                setIsAvatarOpen(false);
                setMenuOpen(false);
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
                onConfirmacion={(config) => {
                  setModalConfig(config);
                  setShowModal(true);
                }}
              />
            </GestionDropdown>

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

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          onClick={() => {
            setMenuOpen((prev) => !prev);
            setIsGestionOpen(false);
            setIsVendedoresOpen(false);
            setIsPendientesOpen(false);
            setIsAvatarOpen(false);
            setIsVendedoresMobileOpen(false);
          }}
          className="md:hidden text-white hover:scale-110 transition-transform cursor-pointer"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MENÚ MÓVIL */}
      <div
        className={`
          md:hidden mx-4 mt-[2px] rounded-b-2xl bg-zinc-900/95 px-6 py-6 text-center shadow-lg
          border-t border-white/10 transform transition-all duration-500 ease-in-out origin-top overflow-hidden
          ${menuOpen ? "scale-y-100 opacity-100 max-h-96" : "scale-y-0 opacity-0 max-h-0"}
        `}
      >
        <div className="flex flex-col gap-4">
          {/* BOTÓN “Gestión” en móvil */}
          <Boton
            className="w-full"
            onClick={() => {
              setIsGestionOpen((prev) => !prev);
              setIsAvatarOpen(false);
              setIsVendedoresMobileOpen(false);
            }}
          >
            Gestión
          </Boton>
          {/* Opciones de “Gestión” en móvil */}
          {isGestionOpen && (
            <div className="space-y-2 px-2 mt-1 text-center">
              {/* Vendedores con submenú */}
              <div>
                <Boton
                  className="w-full mb-1"
                  onClick={() => setIsVendedoresMobileOpen((prev) => !prev)}
                >
                  Vendedores
                </Boton>
                {isVendedoresMobileOpen && (
                  <div className="flex flex-col space-y-1 pl-2 pr-2 mt-1">
                    <Link
                      to="/vendedores/gestionar"
                      onClick={() => setMenuOpen(false)}
                      className="w-full py-2 rounded-lg font-semibold text-white hover:bg-zinc-800 transition"
                      style={{ background: "none", border: "none" }}
                    >
                      Gestionar Vendedores
                    </Link>
                    <Link
                      to="/vendedores/pendientes"
                      onClick={() => setMenuOpen(false)}
                      className="w-full py-2 rounded-lg font-semibold text-white hover:bg-zinc-800 transition"
                      style={{ background: "none", border: "none" }}
                    >
                      Pendientes de aprobar
                    </Link>
                  </div>
                )}
              </div>
              <Link to="/categorias" onClick={() => setMenuOpen(false)}>
                <Boton className="w-full">Categorías</Boton>
              </Link>
              <Link to="/productos" onClick={() => setMenuOpen(false)}>
                <Boton className="w-full">Productos</Boton>
              </Link>
            </div>
          )}

          {/* BOTÓN “Mi cuenta” en móvil */}
          <Boton
            className="w-full"
            onClick={() => {
              setIsAvatarOpen((prev) => !prev);
              setIsGestionOpen(false);
              setIsVendedoresOpen(false);
              setIsPendientesOpen(false);
              setIsVendedoresMobileOpen(false);
            }}
          >
            Mi cuenta
          </Boton>
          {/* Submenú “Mi cuenta” en móvil */}
          {isAvatarOpen && (
            <div className="space-y-2 px-2 mt-1">
              <p className="text-sm text-gray-400">
                Usuario: <span className="text-white font-medium">{nombre}</span>
              </p>
              <p className="text-sm text-gray-400 mb-1">
                Correo: <span className="text-white font-medium">{email}</span>
              </p>
              <BotonClaro onClick={() => setMostrarConfirmacion(true)} className="w-full">
                Cerrar sesión
              </BotonClaro>
            </div>
          )}
        </div>
      </div>

      {mostrarConfirmacion && (
        <ModalConfirmacion
          mensaje="¿Estás seguro de cerrar sesión?"
          onConfirmar={handleLogoutConfirmado}
          onCancelar={() => setMostrarConfirmacion(false)}
        />
      )}

      {/* MODAL GLOBAL PARA APROBAR/ELIMINAR USUARIOS */}
      {showModal && (
        <ModalConfirmacion
          mensaje={modalConfig.mensaje}
          confirmText={modalConfig.confirmText}
          onConfirmar={async () => {
            await modalConfig.onConfirmar();
            setShowModal(false);
          }}
          onCancelar={() => setShowModal(false)}
        />
      )}
    </header>
  );
}
