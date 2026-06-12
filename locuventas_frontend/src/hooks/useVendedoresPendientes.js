// src/hooks/useVendedoresPendientes.js
import { useState, useEffect } from "react";
import { apiRequest } from "@services/api.config";
import { toast } from "react-toastify";

export default function useVendedoresPendientes({ page = 0, size = 10, search = "" } = {}) {
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const cargar = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, size });
      if (search.trim()) params.set("search", search.trim());

      const data = await apiRequest(
        `usuarios/sin-rol?${params}`,
        null,
        { method: "GET" }
      );
      const content = data.data?.content ?? data.data ?? [];
      setPendientes(
        [...content].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
      setTotalPages(data.data?.totalPages ?? 1);
    } catch {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [page, size, search]);

  const aprobar = async (id) => {
    try {
      await apiRequest(`usuarios/${id}/asignar-rol`, {}, { method: "PUT" });
      toast.success("Vendedor aprobado");
      await cargar();
    } catch { toast.error("Error al aprobar"); }
  };

  const eliminar = async (id) => {
    try {
      await apiRequest(`usuarios/${id}`, {}, { method: "DELETE" });
      toast.success("Usuario eliminado");
      await cargar();
    } catch { toast.error("Error al eliminar"); }
  };

  return { pendientes, loading, totalPages, aprobar, eliminar };
}