import { useState, useEffect } from "react";
import { apiRequest } from "@services/api.config";
import { toast } from "react-toastify";

export default function useVendedoresPendientes() {
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      const data = await apiRequest("usuarios/sin-rol", null, { method: "GET" });
      let vendedores = data.data || [];
      setPendientes(vendedores.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch { toast.error("Error al cargar datos"); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargar(); }, []);

  const aprobar = async (id) => {
    await apiRequest(`usuarios/${id}/asignar-rol`, {}, { method: "PUT" });
    setPendientes(p => p.filter(u => u.id !== id));
    toast.success("Vendedor aprobado");
  };

  const eliminar = async (id) => {
    await apiRequest(`usuarios/${id}`, {}, { method: "DELETE" });
    setPendientes(p => p.filter(u => u.id !== id));
    toast.success("Usuario eliminado");
  };

  return { pendientes, loading, aprobar, eliminar };
}