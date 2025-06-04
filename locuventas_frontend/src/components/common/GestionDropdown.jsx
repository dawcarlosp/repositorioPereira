// src/components/common/GestionDropdown.jsx
import { Link } from "react-router-dom";
import React from "react";

export default function GestionDropdown({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full mt-2 right-0 z-50 w-44 bg-zinc-900/90 backdrop-blur-md shadow-xl rounded-xl py-2">
      {/*
        -- Flecha triangular perfecta, centrada en el contenedor --
        left-1/2 y -translate-x-1/2 garantizan que la punta quede justo en el medio.
      */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-zinc-900/90"></div>

      <Link
        to="/vendedores"
        className="block px-4 py-2 text-gray-200 hover:bg-zinc-800 rounded-md transition-colors"
      >
        Vendedores
      </Link>
      <Link
        to="/categorias"
        className="block px-4 py-2 text-gray-200 hover:bg-zinc-800 rounded-md transition-colors"
      >
        Categorías
      </Link>
      <Link
        to="/productos"
        className="block px-4 py-2 text-gray-200 hover:bg-zinc-800 rounded-md transition-colors"
      >
        Productos
      </Link>
    </div>
  );
}
