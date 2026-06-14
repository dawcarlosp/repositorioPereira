// src/hooks/useProductos.js
import { useState, useEffect } from "react";
import { apiRequest } from "@services/api.config";
import { toast } from "react-toastify";

export default function useProductos({
  page = 0,
  size = 12,
  search = "",
  paisId = null,
  categoriaId = null,
} = {}) {
  const [productos, setProductos]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProductos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, size });
        if (search.trim())  params.set("search", search.trim());
        if (paisId)         params.set("paisId", paisId);
        if (categoriaId)    params.set("categoriaId", categoriaId);

        const datos = await apiRequest(
          `productos?${params}`,
          null,
          { method: "GET", signal: controller.signal }
        );
        setProductos(datos.data?.content ?? []);
        setTotalPages(datos.data?.totalPages ?? 0);
      } catch (err) {
        if (err?.name !== "AbortError") {
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