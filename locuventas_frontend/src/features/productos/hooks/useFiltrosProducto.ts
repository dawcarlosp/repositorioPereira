// src/features/productos/hooks/useFiltrosProducto.ts
import { useState, useEffect } from "react";
import { apiRequest } from "@services/api";
import { toast } from "react-toastify";
import type { SelectOption } from "@domain/ui.types";
import type { ApiResponse } from "@domain/api.types";

interface PaisRaw {
  id:          number;
  nombre:      string;
  codigo:      string;
  enlaceFoto:  string | null;
}

interface CategoriaRaw {
  id:     number;
  nombre: string;
}

interface FiltrosProductoReturn {
  paises:     SelectOption[];
  categorias: SelectOption[];
  loading:    boolean;
}

export default function useFiltrosProducto(): FiltrosProductoReturn {

  const [paises,     setPaises]     = useState<SelectOption[]>([]);
  const [categorias, setCategorias] = useState<SelectOption[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {

    const cargar = async (): Promise<void> => {
      try {
        const [resPaises, resCategorias] = await Promise.all([
          apiRequest<ApiResponse<PaisRaw[]>>("paises", null, { method: "GET" }),
          apiRequest<ApiResponse<CategoriaRaw[]>>("categorias", null, { method: "GET" }),
        ]);

        setPaises(
          (resPaises.data ?? []).map((p) => ({
            value: p.id,
            label: p.nombre,

            image: p.enlaceFoto ?? null,
          }))
        );

        setCategorias(
          (resCategorias.data ?? []).map((c) => ({
            value: c.id,
            label: c.nombre,
          }))
        );
      } catch {
        toast.error("Error cargando filtros");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  return { paises, categorias, loading };
}