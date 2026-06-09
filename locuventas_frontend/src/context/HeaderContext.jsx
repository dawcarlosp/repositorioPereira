// src/context/HeaderContext.jsx
import { createContext, useContext, useState } from "react";

const HeaderContext = createContext();

export function HeaderProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isPendientesOpen, setIsPendientesOpen] = useState(false);
   const [modalEditar, setModalEditar] = useState(false);
  
  // 🔓 AGREGAMOS LOS ESTADOS PARA EL LOGOUT QUE FALTABAN
  const [mostrarConfirmacionLogout, setMostrarConfirmacionLogout] = useState(false);

  const closeAll = () => {
    setMenuOpen(false);
    setActiveDropdown(null);
    setIsPendientesOpen(false);
  };

  // 📦 INCLUIMOS LOS NUEVOS ESTADOS EN EL VALUE PARA EXPORTARLOS
  const value = {
    menuOpen,
    setMenuOpen,
    activeDropdown,
    setActiveDropdown,
    isPendientesOpen,
    setIsPendientesOpen,
    mostrarConfirmacionLogout,       
    setMostrarConfirmacionLogout,
    modalEditar,
    setModalEditar,   
    closeAll
  };

  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
}

export const useHeader = () => useContext(HeaderContext);