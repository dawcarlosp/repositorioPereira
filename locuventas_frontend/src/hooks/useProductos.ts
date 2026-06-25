import { useState, useEffect } from "react";
import { apiRequest } from "@services/api";
import { toast } from "react-toastify";
import type { Producto } from "@domain/producto.types";
import type { ApiResponse, PageDTO } from "@domain/api.types";

interface UseProductosOptions {
  page?:        number;
  size?:        number;
  search?:      string;
  paisId?:      number | null;
  categoriaId?: number | null;
}

interface UseProductosReturn {
  productos:   Producto[];
  loading:     boolean;
  totalPages:  number;
}

export default function useProductos({
  page = 0,
  size = 12,
  search = "",
  paisId = null,
  categoriaId = null,
}: UseProductosOptions = {}): UseProductosReturn {
  const [productos,   setProductos]   = useState<Producto[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [totalPages,  setTotalPages]  = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProductos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        if (search.trim())       params.set("search", search.trim());
        if (paisId)              params.set("paisId", String(paisId));
        if (categoriaId)         params.set("categoriaId", String(categoriaId));

        const datos = await apiRequest<ApiResponse<PageDTO<Producto>>>(
          `productos?${params}`,
          null,
          { method: "GET", signal: controller.signal }
        );
        setProductos(datos.data?.content ?? []);
        setTotalPages(datos.data?.totalPages ?? 0);
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          toast.error("Error cargando el catálogo");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
    return () => controller.abort();
  }, [page, size, search, paisId, categoriaId]);

  return { productos, loading, totalPages };
}
