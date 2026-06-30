import { useMemo } from "react";
import usePaginatedFetch from "@hooks/usePaginatedFetch";
import { toast } from "react-toastify";
import type { Producto } from "../domain/producto.types";
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
  const url = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (search.trim())       params.set("search", search.trim());
    if (paisId)              params.set("paisId", String(paisId));
    if (categoriaId)         params.set("categoriaId", String(categoriaId));
    return `productos?${params}`;
  }, [page, size, search, paisId, categoriaId]);

  const { data, loading, totalPages } = usePaginatedFetch<Producto, ApiResponse<PageDTO<Producto>>>({
    url,
    extractData: (res) => ({
      content: res.data?.content ?? [],
      totalPages: res.data?.totalPages ?? 0,
    }),
    onError: () => toast.error("Error cargando el catálogo"),
  });

  return { productos: data, loading, totalPages };
}
