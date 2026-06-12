// src/hooks/useHeaderManager.js
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/useAuth";
import { useHeader } from "@context/HeaderContext";

export default function useHeaderManager() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  const {
    menuOpen, setMenuOpen,
    activeDropdown, setActiveDropdown,
    isPendientesOpen, setIsPendientesOpen,
    modalEditar, setModalEditar,
    mostrarConfirmacionLogout, setMostrarConfirmacionLogout,
  } = useHeader();

  // Estado para el modal de confirmación genérico (aprobar/eliminar vendedores, etc.)
  const [confirmacionGlobal, setConfirmacionGlobal] = useState(null);

  const abrirConfirmacionGlobal = ({ mensaje, confirmText, onConfirmar }) => {
    setConfirmacionGlobal({ mensaje, confirmText, onConfirmar });
  };

  const cerrarConfirmacionGlobal = () => setConfirmacionGlobal(null);

  const [breakpoint, setBreakpoint] = useState(
    window.innerWidth < 1024 ? "sm" : "lg",
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint("xs");
      else if (width < 768) setBreakpoint("sm");
      else if (width < 1024) setBreakpoint("md");
      else setBreakpoint("lg");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const clickOutside = (e) => {
      if (mostrarConfirmacionLogout || modalEditar || confirmacionGlobal) return;
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        closeAll();
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, [mostrarConfirmacionLogout, modalEditar, confirmacionGlobal]);

  const handleLogout = () => {
    setAuth({ token: null, nombre: null, foto: null, email: null, roles: [] });
    setMostrarConfirmacionLogout(false);
    closeAll();
    navigate("/");
  };

  const closeAll = () => {
    setActiveDropdown(null);
    setIsPendientesOpen(false);
    setMenuOpen(false);
  };

  return {
    auth,
    headerRef,
    menuOpen, setMenuOpen,
    activeDropdown, setActiveDropdown,
    isPendientesOpen, setIsPendientesOpen,
    modalEditar, setModalEditar,
    mostrarConfirmacionLogout, setMostrarConfirmacionLogout,
    handleLogout,
    closeAll,
    breakpoint,
    // Modal de confirmación genérico
    confirmacionGlobal,
    abrirConfirmacionGlobal,
    cerrarConfirmacionGlobal,
  };
}