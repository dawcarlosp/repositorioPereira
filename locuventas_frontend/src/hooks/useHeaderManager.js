import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/useAuth";

export default function useHeaderManager() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'gestion', 'vendedores', 'avatar', null
  const [modalEditar, setModalEditar] = useState(false);
  const [mostrarConfirmacionLogout, setMostrarConfirmacionLogout] = useState(false);

  // Cerrar todo al hacer click fuera
  useEffect(() => {
    const clickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleLogout = () => {
    setAuth({ token: null, nombre: null, foto: null, email: null, roles: [] });
    navigate("/");
  };

  const closeAll = () => {
    setActiveDropdown(null);
    setMenuOpen(false);
  };

  return {
    auth, headerRef, menuOpen, setMenuOpen,
    activeDropdown, setActiveDropdown,
    modalEditar, setModalEditar,
    mostrarConfirmacionLogout, setMostrarConfirmacionLogout,
    handleLogout, closeAll
  };
}