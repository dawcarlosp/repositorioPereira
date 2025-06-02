import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

import AvatarUsuario from "../components/common/AvatarUsuario"; // Ajusta la ruta según tu estructura
import { useAuth } from "../context/useAuth"; // También importa el hook de autenticación


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const { nombre, foto } = useAuth();
  useEffect(() => {
    setTimeout(() => setShowHeader(true), 100);
  }, []);

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-700 ease-out transform ${
        showHeader ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between rounded-b-2xl shadow-lg backdrop-blur-md bg-gradient-to-r from-blue-500 via-white to-purple-500/90 border-b border-white/20">
        {/* LOGO / NOMBRE */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-white tracking-wide hover:scale-105 transition-transform duration-200 drop-shadow-sm bg-zinc-900 p-2 rounded-xl"
        >
          Locu<span className="text-orange-400">Ventas</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="text-white hover:text-orange-400 font-medium bg-zinc-900 p-2 rounded-xl">Gestión</Link>
          <Link to="/dashboard" className="text-white hover:text-orange-400 font-medium bg-zinc-900 p-2 rounded-xl">Vendedores</Link>
          <Link to="/contacto" className="text-white hover:text-orange-400 font-medium bg-zinc-900 p-2 rounded-xl">Cerrar Sesión</Link>
          {/* Avatar del usuario */}
        {foto && nombre && <AvatarUsuario foto={foto} nombre={nombre} />}
        </nav>

        {/* HAMBURGER */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white hover:scale-110 transition-transform cursor-pointer"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE NAV */}
      <div
        className={`md:hidden mx-4 mt-[2px] rounded-b-2xl bg-gray-900/95 px-6 py-5 space-y-4 text-center shadow-lg border-t border-white/10 transform transition-all duration-500 ease-in-out origin-top overflow-hidden ${
          menuOpen ? "scale-y-100 opacity-100 max-h-96" : "scale-y-0 opacity-0 max-h-0"
        }`}
      >
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className={`block text-white text-lg hover:text-orange-400 font-semibold transition duration-300 delay-100 ${
            menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          Inicio
        </Link>
        <Link
          to="/dashboard"
          onClick={() => setMenuOpen(false)}
          className={`block text-white text-lg hover:text-orange-400 font-semibold transition duration-300 delay-200 ${
            menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/contacto"
          onClick={() => setMenuOpen(false)}
          className={`block text-white text-lg hover:text-orange-400 font-semibold transition duration-300 delay-300 ${
            menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          Cerrar sesión
        </Link>
      </div>
    </header>
  );
}
