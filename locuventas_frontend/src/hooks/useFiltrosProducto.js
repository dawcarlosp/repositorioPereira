// src/hooks/useFiltrosProducto.js
import { useState, useEffect } from "react";
import { apiRequest } from "@services/api.config";
import { toast } from "react-toastify";

export default function useFiltrosProducto() {
  const [paises, setPaises]         = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resPaises, resCategorias] = await Promise.all([
          apiRequest("paises", null, { method: "GET" }),
          apiRequest("categorias", null, { method: "GET" }),
        ]);

        // Pais devuelve la entidad directa: { id, nombre, codigo, enlaceFoto }
        setPaises(
          (resPaises.data ?? []).map((p) => ({
            value: p.id,
            label: p.nombre,
            image: p.enlaceFoto ?? null,
          }))
        );

        // Categoria usa DTO: { id, nombre }
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
  }, []); // solo una vez — son catálogos maestros

  return { paises, categorias, loading };
}