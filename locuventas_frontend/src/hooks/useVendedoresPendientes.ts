import { useState, useEffect } from "react";
import { apiRequest } from "@services/api";
import { toast } from "react-toastify";
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
  const [pendientes, setPendientes] = useState<UsuarioPendiente[]>([]);
  const [loading, setLoading]       = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const cargar = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), size: String(size) });
      if (search.trim()) params.set("search", search.trim());

      const data = await apiRequest<ApiResponse<PageDTO<UsuarioPendiente>>>(
        `usuarios/sin-rol?${params}`,
        null,
        { method: "GET" }
      );
      const content = data.data?.content ?? data.data ?? [];
      setPendientes(
        [...content].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
      setTotalPages(data.data?.totalPages ?? 1);
    } catch {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [page, size, search]);

  const aprobar = async (id: number) => {
    try {
      await apiRequest(`usuarios/${id}/asignar-rol`, {}, { method: "PUT" });
      toast.success("Vendedor aprobado");
      await cargar();
    } catch { toast.error("Error al aprobar"); }
  };

  const eliminar = async (id: number) => {
    try {
      await apiRequest(`usuarios/${id}`, {}, { method: "DELETE" });
      toast.success("Usuario eliminado");
      await cargar();
    } catch { toast.error("Error al eliminar"); }
  };

  return { pendientes, loading, totalPages, aprobar, eliminar };
}
