// src/context/HeaderContext.jsx
import { createContext, useContext, useState } from "react";

const HeaderContext = createContext();

export function HeaderProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Función para cerrar todo de golpe
  const closeAll = () => {
    setMenuOpen(false);
    setActiveDropdown(null);
  };

  const value = {
    menuOpen,
    setMenuOpen,
    activeDropdown,
    setActiveDropdown,
    closeAll
  };

  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
}

// Hook personalizado para usarlo fácilmente
export const useHeader = () => useContext(HeaderContext);