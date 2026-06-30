import { useState, useMemo } from "react";
import { apiRequest } from "@services/api";
import { toast } from "react-toastify";
import usePaginatedFetch from "@hooks/usePaginatedFetch";
import type { ApiResponse, PageDTO } from "@domain/api.types";
import type { UsuarioPendiente } from "@/features/auth/domain/auth.types";

interface UseVendedoresPendientesOptions {
  page?:   number;
  size?:   number;
  search?: string;
}

interface UseVendedoresPendientesReturn {
  pendientes:  UsuarioPendiente[];
  loading:     boolean;
  totalPages:  number;
  aprobar:     (id: number) => Promise<void>;
  eliminar:    (id: number) => Promise<void>;
}

export default function useVendedoresPendientes({
  page = 0,
  size = 10,
  search = "",
}: UseVendedoresPendientesOptions = {}): UseVendedoresPendientesReturn {
  const [refreshKey, setRefreshKey] = useState(0);

  const url = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (search.trim()) params.set("search", search.trim());
    return `usuarios/sin-rol?${params}`;
  }, [page, size, search, refreshKey]);

  const { data, loading, totalPages } = usePaginatedFetch<UsuarioPendiente, ApiResponse<PageDTO<UsuarioPendiente>>>({
    url,
    extractData: (res) => {
      const content = res.data?.content ?? (res as unknown as { content: UsuarioPendiente[] })?.content ?? [];
      const sorted = [...content].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return {
        content: sorted,
        totalPages: res.data?.totalPages ?? 1,
      };
    },
    onError: () => toast.error("Error al cargar datos"),
  });

  const cargar = () => setRefreshKey((k) => k + 1);

  const aprobar = async (id: number) => {
    try {
      await apiRequest(`usuarios/${id}/asignar-rol`, {}, { method: "PUT" });
      toast.success("Vendedor aprobado");
      cargar();
    } catch { toast.error("Error al aprobar"); }
  };

  const eliminar = async (id: number) => {
    try {
      await apiRequest(`usuarios/${id}`, {}, { method: "DELETE" });
      toast.success("Usuario eliminado");
      cargar();
    } catch { toast.error("Error al eliminar"); }
  };

  return { pendientes: data, loading, totalPages, aprobar, eliminar };
}
