import React, { useEffect, useState, useRef } from "react";
import { apiRequest } from "@services/api";
import defaultAvatar from "@assets/default-avatar.png";
import BotonClaro from "@components/common/BotonClaro";
import Boton from "@components/common/Boton";
import ModalConfirmacion from "@components/common/ModalConfirmacion";
import { useAuth } from "@context/useAuth";
import Header from "@components/Header";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function VendedoresPendientes() {
  const { auth } = useAuth();
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Header sticky
  const headerRef = useRef();
  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
  }, []);

  // Modal de confirmación global
  const [modal, setModal] = useState({
    open: false,
    mensaje: "",
    confirmText: "",
    onConfirmar: null,
  });

  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const data = await apiRequest(
          "usuarios/sinrol",
          null,
          { method: "GET" }
        );
        // Ordenar por fecha de creación DESCENDENTE (más reciente primero)
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPendientes(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendientes();
  }, [auth.token]);

  // Aprobar usuario: abre modal de confirmación
  const handleAprobar = (usuario) => {
    setModal({
      open: true,
      mensaje: `¿Seguro que quieres aprobar a ${usuario.nombre}?`,
      confirmText: "Aprobar",
      onConfirmar: async () => {
        await apiRequest(`usuarios/${usuario.id}/asignar-rol`, {}, { method: "PUT" });
        setPendientes((prev) => prev.filter((u) => u.id !== usuario.id));
      },
    });
  };

  // Eliminar usuario: abre modal de confirmación
  const handleDenegar = (usuario) => {
    setModal({
      open: true,
      mensaje: `¿Seguro que quieres eliminar a ${usuario.nombre}? Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      onConfirmar: async () => {
        await apiRequest(`usuarios/${usuario.id}`, {}, { method: "DELETE" });
        setPendientes((prev) => prev.filter((u) => u.id !== usuario.id));
      },
    });
  };

  // Confirma acción y cierra modal
  const confirmarYcerrar = async () => {
    if (modal.onConfirmar) await modal.onConfirmar();
    setModal({ open: false, mensaje: "", confirmText: "", onConfirmar: null });
  };

  return (
    <div className="min-h-screen bg-zinc-900 w-full">
      {/* HEADER sticky arriba */}
      <div
        style={{ position: "fixed", width: "100%", zIndex: 50, top: 0, left: 0 }}
      >
        <Header ref={headerRef} />
      </div>

      <main
        className="max-w-2xl mx-auto px-4 py-10"
        style={{ paddingTop: headerHeight || 100 }}
      >
        <h1 className="text-2xl font-bold text-white mb-8 text-center">
          Pendientes de aprobar
        </h1>

        <div
          className="
            bg-zinc-900/90 backdrop-blur-md shadow-xl rounded-xl p-6
            max-h-[75vh] overflow-y-auto overflow-x-hidden
          "
          style={{ scrollbarGutter: "stable" }}
        >
          {loading && <p className="text-gray-300 py-8 text-center">Cargando pendientes…</p>}

          {error && (
            <p className="text-red-400 py-4 text-center">
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
                      backdrop-blur-sm rounded-xl px-5 py-4 space-x-6
                    "
                  >
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      <div
                        tabIndex={0}
                        className="transition-transform duration-200 ease-in-out hover:scale-150 hover:z-10 focus:scale-150 focus:z-10 outline-none"
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
                        {/* Fecha tipo Instagram */}
                        <span className="text-gray-500 text-xs mt-1">
                          {formatDistanceToNow(new Date(usuario.createdAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4 min-w-[90px]">
                      <BotonClaro
                        onClick={() => handleAprobar(usuario)}
                        className="text-sm px-4 py-1 rounded-lg whitespace-nowrap"
                      >
                        Aprobar
                      </BotonClaro>
                      <Boton
                        onClick={() => handleDenegar(usuario)}
                        className="text-sm px-4 py-1 rounded-lg whitespace-nowrap"
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

        {/* Modal de confirmación */}
        {modal.open && (
          <ModalConfirmacion
            mensaje={modal.mensaje}
            confirmText={modal.confirmText}
            onConfirmar={confirmarYcerrar}
            onCancelar={() =>
              setModal({ open: false, mensaje: "", confirmText: "", onConfirmar: null })
            }
          />
        )}
      </main>
    </div>
  );
}
