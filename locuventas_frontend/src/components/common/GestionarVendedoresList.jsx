// src/components/common/GestionarVendedoresList.jsx

import React, { useState, useEffect } from "react";
import { apiRequest } from "../../services/api";          // ← Tu helper de fetch
import defaultAvatar from "../../assets/default-avatar.png";   // ← El avatar por defecto que ya usas
import BotonClaro from "./BotonClaro";
import { useAuth } from "../../context/useAuth";

export default function GestionarVendedoresList({ onClose }) {
  const { auth } = useAuth();
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1) Al montarse, recuperamos del backend los usuarios sin rol VENDEDOR ni ADMIN
  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        const data = await apiRequest(
          "usuarios/sinrol",
          null,
          { method: "GET" }
        );
        setVendedores(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendedores();
  }, [auth.token]);

  // 2) Autorizar (asignar rol VENDEDOR)
  const handleAutorizar = async (usuario) => {
    if (!window.confirm(`¿Seguro que quieres autorizar a ${usuario.nombre}?`)) {
      return;
    }
    try {
      await apiRequest(`usuarios/${usuario.id}/asignar-rol`, {}, { method: "PUT" });
      // Tras éxito, descartamos al usuario del array local para que desaparezca
      setVendedores((prev) => prev.filter((u) => u.id !== usuario.id));
    } catch (err) {
      console.error(err);
      alert(err.error || "Error al autorizar vendedor. Comprueba la consola.");
    }
  };

  // 3) Desautorizar (quitar rol VENDEDOR)
  const handleDesautorizar = async (usuario) => {
    if (!window.confirm(`¿Seguro que quieres desautorizar a ${usuario.nombre}?`)) {
      return;
    }
    try {
      await apiRequest(`usuarios/${usuario.id}/quitar-rol`, {}, { method: "PUT" });
      setVendedores((prev) => prev.filter((u) => u.id !== usuario.id));
    } catch (err) {
      console.error(err);
      alert(err.error || "Error al desautorizar vendedor. Comprueba la consola.");
    }
  };

  return (
    <div
      className="
        absolute left-full top-0
        ml-2
        w-72 z-50 bg-zinc-900/90 
        backdrop-blur-md shadow-xl 
        rounded-xl py-2 animate-fade-in
        max-h-80 overflow-y-auto
      "
    >
      {/* Flecha que apunta al panel padre */}
      <div
        className="
          absolute -left-2
          top-1/5 -translate-y-1/2
          w-4 h-4 bg-zinc-900/90 rotate-45
        "
      />

      {/* Encabezado con título y botón de cerrar */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-700">
        <h4 className="text-white font-semibold">Gestión de vendedores</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition"
          aria-label="Cerrar panel"
        >
          ✕
        </button>
      </div>

      {/* Cuerpo: loading / error / listado */}
      <div className="px-4 py-2">
        {loading && <p className="text-gray-300">Cargando vendedores…</p>}

        {error && (
          <p className="text-red-400">
            Error al cargar: <span className="font-medium">{JSON.stringify(error)}</span>
          </p>
        )}

        {!loading && !error && vendedores.length === 0 && (
          <p className="text-gray-300">No hay vendedores para gestionar.</p>
        )}

        {!loading && !error && vendedores.length > 0 && (
          <ul className="space-y-2">
            {vendedores.map((usuario) => {
              // Construir URL de la foto o usar avatar por defecto
              const fotoUrl = usuario.foto
                ? `${import.meta.env.VITE_API_URL}/imagenes/vendedores/${usuario.foto}`
                : defaultAvatar;

              // Comprobamos si ya tiene ROLE_VENDEDOR (en caso de que tu endpoint lo incluyera)
              const yaEsVendedor = usuario.authorities?.some(
                (gr) => gr.authority === "ROLE_VENDEDOR"
              );

              return (
                <li
                  key={usuario.id}
                  className="flex items-center justify-between bg-zinc-800/60 
                             backdrop-blur-sm rounded-lg px-3 py-2"
                >
                  {/* Avatar + nombre + email */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={fotoUrl}
                      alt={`Avatar de ${usuario.nombre}`}
                      onError={(e) => (e.currentTarget.src = defaultAvatar)}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-400"
                    />
                    <div className="flex flex-col">
                      <span className="text-white font-medium">
                        {usuario.nombre}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {usuario.email}
                      </span>
                    </div>
                  </div>

                  {/* Botones “Autorizar” o “Desautorizar” */}
                  <div className="flex space-x-2">
                    {!yaEsVendedor ? (
                      <button
                        onClick={() => handleAutorizar(usuario)}
                        className="
                          px-2 py-1 bg-green-500 text-white text-sm 
                          rounded hover:bg-green-600 transition
                        "
                      >
                        Autorizar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDesautorizar(usuario)}
                        className="
                          px-2 py-1 bg-red-500 text-white text-sm 
                          rounded hover:bg-red-600 transition
                        "
                      >
                        Desautorizar
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
