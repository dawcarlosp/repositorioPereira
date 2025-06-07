import React, { useState, useEffect } from "react";
import { apiRequest } from "../../services/api";
import defaultAvatar from "../../assets/default-avatar.png";
import BotonClaro from "./BotonClaro";
import Boton from "./Boton";
import { useAuth } from "../../context/useAuth";
import { toast } from "react-toastify";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function PendientesList({ onClose, onConfirmacion }) {
  const { auth } = useAuth();
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const data = await apiRequest(
          "usuarios/sinrol",
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

  const handleAprobar = (usuario) => {
    onConfirmacion({
      mensaje: `¿Seguro que quieres aprobar a ${usuario.nombre}?`,
      confirmText: "Aprobar",
      onConfirmar: async () => {
        await apiRequest(`usuarios/${usuario.id}/asignar-rol`, {}, { method: "PUT" });
        setPendientes((prev) => prev.filter((u) => u.id !== usuario.id));
         toast.success("Usuario aprobado correctamente");
      },
    });
  };

  const handleDenegar = (usuario) => {
    onConfirmacion({
      mensaje: `¿Seguro que quieres eliminar a ${usuario.nombre}? Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      onConfirmar: async () => {
        await apiRequest(`usuarios/${usuario.id}`, {}, { method: "DELETE" });
        setPendientes((prev) => prev.filter((u) => u.id !== usuario.id));
         toast.success("Usuario eliminado correctamente");
      },
    });
  };

  return (
    <div
      className="
        relative w-full max-w-[420px] mx-auto bg-zinc-900/90 
        backdrop-blur-md shadow-xl 
        rounded-xl pt-3 pb-4 animate-fade-in
        max-h-[90vh]
        overflow-y-auto
        overflow-x-hidden
        sm:w-[420px]
      "
      style={{ scrollbarGutter: "stable" }}
    >
      <div
        className="
          absolute -top-2 right-24
          w-5 h-5
          bg-zinc-900/90
          rotate-45
          shadow-lg
          border-t border-l border-zinc-700
          z-20
        "
      />
      <div className="flex justify-between items-center px-3 sm:px-8 py-3 border-b border-zinc-700">
        <h4 className="text-white font-semibold text-lg">Pendientes de aprobar</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition text-2xl"
          aria-label="Cerrar panel"
        >
          ✕
        </button>
      </div>
      <div className="px-2 sm:px-6 py-4">
        {loading && <p className="text-gray-300 py-8 text-center">Cargando pendientes…</p>}

        {error && (
          <p className="text-red-400 py-4">
            Error al cargar: <span className="font-medium">{JSON.stringify(error)}</span>
          </p>
        )}

        {!loading && !error && pendientes.length === 0 && (
          <p className="text-gray-300 py-8 text-center">No hay pendientes por aprobar.</p>
        )}

        {!loading && !error && pendientes.length > 0 && (
          <ul className="space-y-5">
            {pendientes.map((usuario) => {
              const fotoUrl = usuario.foto
                ? `${import.meta.env.VITE_API_URL}/imagenes/vendedores/${usuario.foto}`
                : defaultAvatar;

              return (
                <li
                  key={usuario.id}
                  className="flex items-center justify-between bg-zinc-800/60
                    backdrop-blur-sm rounded-xl px-2 sm:px-5 py-4
                    space-x-3 sm:space-x-6
                  "
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <div
                      tabIndex={0}
                      className="
                        transition-transform duration-200 ease-in-out
                        hover:scale-150 hover:z-10
                        focus:scale-150 focus:z-10
                        outline-none
                      "
                    >
                      <img
                        src={fotoUrl}
                        alt={`Avatar de ${usuario.nombre}`}
                        onError={(e) => (e.currentTarget.src = defaultAvatar)}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-400 shrink-0"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-medium text-base">
                        {usuario.nombre}
                      </span>
                      <span className="text-gray-400 text-sm break-all">
                        {usuario.email}
                      </span>
                      {/* FECHA tipo Instagram */}
                      <span className="text-gray-500 text-xs mt-1">
                        {formatDistanceToNow(new Date(usuario.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-2 sm:ml-4 min-w-[90px]">
                    <BotonClaro
                      onClick={() => handleAprobar(usuario)}
                      className="text-sm sm:text-base px-2 py-2 sm:px-4 sm:py-1 rounded-lg whitespace-nowrap"
                    >
                      Aprobar
                    </BotonClaro>
                    <Boton
                      onClick={() => handleDenegar(usuario)}
                      className="text-sm sm:text-base px-2 py-2 sm:px-4 sm:py-1 rounded-lg whitespace-nowrap"
                    >
                      Denegar
                    </Boton>
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
