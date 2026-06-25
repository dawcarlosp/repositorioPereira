// src/context/HeaderContext.tsx
import { createContext, useContext, useState } from "react";

interface HeaderContextValue {
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
  closeAll:                    () => void;
}

const HeaderContext = createContext<HeaderContextValue | null>(null);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [menuOpen,                    setMenuOpen]                    = useState(false);
  const [activeDropdown,              setActiveDropdown]              = useState<string | null>(null);
  const [isPendientesOpen,            setIsPendientesOpen]            = useState(false);
  const [modalEditar,                 setModalEditar]                 = useState(false);
  const [mostrarConfirmacionLogout,   setMostrarConfirmacionLogout]   = useState(false);

  const closeAll = (): void => {
    setMenuOpen(false);
    setActiveDropdown(null);
    setIsPendientesOpen(false);
  };

  return (
    <HeaderContext.Provider value={{
      menuOpen,                    setMenuOpen,
      activeDropdown,              setActiveDropdown,
      isPendientesOpen,            setIsPendientesOpen,
      modalEditar,                 setModalEditar,
      mostrarConfirmacionLogout,   setMostrarConfirmacionLogout,
      closeAll,
    }}>
      {children}
    </HeaderContext.Provider>
  );
}

export const useHeader = (): HeaderContextValue => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader debe usarse dentro de un HeaderProvider");
  }
  return context;
};