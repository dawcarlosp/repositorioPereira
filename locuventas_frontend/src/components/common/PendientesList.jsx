// src/components/common/PendientesList.jsx

import React, { useState, useEffect } from "react";
import { apiRequest } from "../../services/api";     // Tu helper de fetch
import defaultAvatar from "../../assets/default-avatar.png";
import BotonClaro from "./BotonClaro";
import { useAuth } from "../../context/useAuth";

export default function PendientesList({ onClose }) {
  const { auth } = useAuth();
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1) Al montarse, hacer GET /usuarios/pendientes-de-aprobar
  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const data = await apiRequest(
          "usuarios/sinrol", // Ajusta esta ruta si tu API la llama diferente
          null,
          { method: "GET" }
        );
        setPendientes(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendientes();
  }, [auth.token]);

  // 2) Aprobar usuario
  const handleAprobar = async (usuario) => {
    if (!window.confirm(`¿Seguro que quieres aprobar a ${usuario.nombre}?`)) {
      return;
    }
    try {
      // Supongamos PUT /usuarios/{id}/aprobar
      await apiRequest(`usuarios/${usuario.id}/aprobar`, {}, { method: "PUT" });
      setPendientes((prev) => prev.filter((u) => u.id !== usuario.id));
    } catch (err) {
      console.error(err);
      alert(err.error || "Error al aprobar usuario. Comprueba la consola.");
    }
  };

  // 3) Denegar usuario
  const handleDenegar = async (usuario) => {
    if (!window.confirm(`¿Seguro que quieres denegar a ${usuario.nombre}?`)) {
      return;
    }
    try {
      // Supongamos DELETE /usuarios/{id}/pendiente
      await apiRequest(`usuarios/${usuario.id}/pendiente`, {}, { method: "DELETE" });
      setPendientes((prev) => prev.filter((u) => u.id !== usuario.id));
    } catch (err) {
      console.error(err);
      alert(err.error || "Error al denegar usuario. Comprueba la consola.");
    }
  };

  return (
    <div
      className="
         relative w-72 bg-zinc-900/90 
    backdrop-blur-md shadow-xl 
    rounded-xl py-2 animate-fade-in
    max-h-80 overflow-y-auto
      "
    >
      {/* Flecha que apunta al panel “Vendedores” */}
      <div
        className="
         absolute -right-2 top-[36px] w-4 h-4 bg-zinc-900/90 rotate-45
        "
      />

      {/* Encabezado con título y botón de cerrar */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-700">
        <h4 className="text-white font-semibold">Pendientes de aprobar</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition"
          aria-label="Cerrar panel"
        >
          ✕
        </button>
      </div>

      {/* Cuerpo: loading / error / lista */}
      <div className="px-4 py-2">
        {loading && <p className="text-gray-300">Cargando pendientes…</p>}

        {error && (
          <p className="text-red-400">
            Error al cargar: <span className="font-medium">{JSON.stringify(error)}</span>
          </p>
        )}

        {!loading && !error && pendientes.length === 0 && (
          <p className="text-gray-300">No hay pendientes por aprobar.</p>
        )}

        {!loading && !error && pendientes.length > 0 && (
          <ul className="space-y-2">
            {pendientes.map((usuario) => {
              const fotoUrl = usuario.foto
                ? `${import.meta.env.VITE_API_URL}/imagenes/vendedores/${usuario.foto}`
                : defaultAvatar;

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

                  {/* Botones “Aprobar” / “Denegar” */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAprobar(usuario)}
                      className="
                        px-2 py-1 bg-green-500 text-white text-sm 
                        rounded hover:bg-green-600 transition
                      "
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleDenegar(usuario)}
                      className="
                        px-2 py-1 bg-red-500 text-white text-sm 
                        rounded hover:bg-red-600 transition
                      "
                    >
                      Denegar
                    </button>
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
