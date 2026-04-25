// src/hooks/useHeaderManager.js
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/useAuth";
import { useHeader } from "@context/HeaderContext"; // <--- Importamos el Context

export default function useHeaderManager() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  // EXTRAEMOS LOS ESTADOS DEL CONTEXTO (Globales)
  const { 
    menuOpen, setMenuOpen, 
    activeDropdown, setActiveDropdown,
    isPendientesOpen, setIsPendientesOpen,
    modalEditar, setModalEditar,
    mostrarConfirmacionLogout, setMostrarConfirmacionLogout
  } = useHeader(); 

  // La lógica de cerrar al hacer click fuera se mantiene igual, 
  // pero ahora cerrará el estado GLOBAL.
  useEffect(() => {
    const clickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        closeAll();
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleLogout = () => {
    setAuth({ token: null, nombre: null, foto: null, email: null, roles: [] });
    closeAll(); // Limpiamos menús al salir
    navigate("/");
  };

  const closeAll = () => {
    setActiveDropdown(null);
    setIsPendientesOpen(false);
    setMenuOpen(false);
  };

  return {
    auth, headerRef, menuOpen, setMenuOpen,
    activeDropdown, setActiveDropdown,
    isPendientesOpen, setIsPendientesOpen,
    modalEditar, setModalEditar,
    mostrarConfirmacionLogout, setMostrarConfirmacionLogout,
    handleLogout, closeAll
  };
}