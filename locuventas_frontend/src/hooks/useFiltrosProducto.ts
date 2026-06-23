// src/hooks/useFiltrosProducto.ts
import { useState, useEffect } from "react";
import { apiRequest } from "@services/api";
import { toast } from "react-toastify";
import type { FiltrosProducto, SelectOption } from "@/types/producto.types";

export default function useFiltrosProducto(): FiltrosProducto {
  const [paises,     setPaises]     = useState<SelectOption[]>([]);
  const [categorias, setCategorias] = useState<SelectOption[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resPaises, resCategorias] = await Promise.all([
          apiRequest("paises",     null, { method: "GET" }),
          apiRequest("categorias", null, { method: "GET" }),
        ]);

        setPaises(
          (resPaises.data ?? []).map((p: any) => ({
            value: p.id as number,
            label: p.nombre as string,
            image: p.enlaceFoto ?? null,
          }))
        );

        setCategorias(
          (resCategorias.data ?? []).map((c: any) => ({
            value: c.id as number,
            label: c.nombre as string,
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