// src/context/HeaderContext.jsx
import { createContext, useContext, useState } from "react";

const HeaderContext = createContext();

export function HeaderProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  // Centralizamos los estados que antes daban error
  const [isPendientesOpen, setIsPendientesOpen] = useState(false);

  const closeAll = () => {
    setMenuOpen(false);
    setActiveDropdown(null);
    setIsPendientesOpen(false); // Ahora esto no fallará
  };

  const value = {
    menuOpen, setMenuOpen,
    activeDropdown, setActiveDropdown,
    isPendientesOpen, setIsPendientesOpen,
    closeAll
  };

  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
}

export const useHeader = () => useContext(HeaderContext);