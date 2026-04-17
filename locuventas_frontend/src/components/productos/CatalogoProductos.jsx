// src/components/productos/CatalogoProductos.jsx
import React, { useEffect, useState } from "react";
import { apiRequest } from "@services/api.config";
import ProductoSimpleCard from "./ProductoSimpleCard";
import Paginacion from "@components/common/Paginacion";

export default function CatalogoProductos({ carga, agregarProducto }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 12;

  useEffect(() => {
    fetchProductos();
  }, [page]);

  async function fetchProductos() {
    setLoading(true);
    try {
      const datos = await apiRequest(`productos?page=${page}&size=${size}`, null, {
        method: "GET",
      });
      setProductos(datos.data.content || []);
      setTotalPages(datos.totalPages || 0);
    } catch (err) {
      console.error("Error cargando productos:", err);
    } finally {
      setLoading(false);
    }
  }

  const getCantidad = (id) => carga.find(i => i.producto.id === id)?.cantidad || 0;

  if (loading) return <div className="text-center py-10 text-white">Cargando catálogo...</div>;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((prod) => (
          <div key={prod.id} onClick={() => agregarProducto(prod)} className="cursor-pointer">
            <ProductoSimpleCard producto={prod} cantidad={getCantidad(prod.id)} />
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <Paginacion page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}