// src/hooks/useHeaderManager.ts
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/useAuth";
import { useHeader } from "@context/HeaderContext";
import type { Auth, ConfirmacionGlobal } from "@domain/auth.types";
import type { Breakpoint } from "@domain/ui.types";

interface UseHeaderManagerReturn {
  auth:                        Auth;
  headerRef:                   React.RefObject<HTMLElement | null>;
  menuOpen:                    boolean;
  setMenuOpen:                 (v: boolean) => void;
  activeDropdown:              string | null;
  setActiveDropdown:           (v: string | null) => void;
  isPendientesOpen:            boolean;
  setIsPendientesOpen:         (v: boolean) => void;
  modalEditar:                 boolean;
  setModalEditar:              (v: boolean) => void;
  mostrarConfirmacionLogout:   boolean;
  setMostrarConfirmacionLogout:(v: boolean) => void;
  handleLogout:                () => void;
  closeAll:                    () => void;
  breakpoint:                  Breakpoint;
  confirmacionGlobal:          ConfirmacionGlobal | null;
  abrirConfirmacionGlobal:     (config: ConfirmacionGlobal) => void;
  cerrarConfirmacionGlobal:    () => void;
}

const getBreakpoint = (): Breakpoint => {
  const w = window.innerWidth;
  if (w < 640)  return "xs";
  if (w < 768)  return "sm";
  if (w < 1024) return "md";
  return "lg";
};

export default function useHeaderManager(): UseHeaderManagerReturn {
  const { auth, setAuth }  = useAuth();
  const navigate           = useNavigate();
  const headerRef          = useRef<HTMLElement>(null);

  const {
    menuOpen,                    setMenuOpen,
    activeDropdown,              setActiveDropdown,
    isPendientesOpen,            setIsPendientesOpen,
    modalEditar,                 setModalEditar,
    mostrarConfirmacionLogout,   setMostrarConfirmacionLogout,
  } = useHeader();

  const [confirmacionGlobal, setConfirmacionGlobal] =
    useState<ConfirmacionGlobal | null>(null);

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint);

  const abrirConfirmacionGlobal = (config: ConfirmacionGlobal): void => {
    setConfirmacionGlobal(config);
  };

  const cerrarConfirmacionGlobal = (): void => setConfirmacionGlobal(null);

  const closeAll = (): void => {
    setActiveDropdown(null);
    setIsPendientesOpen(false);
    setMenuOpen(false);
  };

  const handleLogout = (): void => {
    setAuth({ token: null, nombre: null, foto: null, email: null, roles: [] });
    setMostrarConfirmacionLogout(false);
    closeAll();
    navigate("/");
  };

  // Resize
  useEffect(() => {
    const handleResize = (): void => setBreakpoint(getBreakpoint());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Click outside
  useEffect(() => {
    const clickOutside = (e: MouseEvent): void => {
      if (mostrarConfirmacionLogout || modalEditar || confirmacionGlobal) return;
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closeAll();
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, [mostrarConfirmacionLogout, modalEditar, confirmacionGlobal]);

  return {
    auth,
    headerRef,
    menuOpen,                    setMenuOpen,
    activeDropdown,              setActiveDropdown,
    isPendientesOpen,            setIsPendientesOpen,
    modalEditar,                 setModalEditar,
    mostrarConfirmacionLogout,   setMostrarConfirmacionLogout,
    handleLogout,
    closeAll,
    breakpoint,
    confirmacionGlobal,
    abrirConfirmacionGlobal,
    cerrarConfirmacionGlobal,
  };
}