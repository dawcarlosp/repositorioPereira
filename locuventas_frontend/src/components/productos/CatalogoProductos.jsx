// src/components/productos/CatalogoProductos.jsx
import React, { useEffect, useState } from "react";
import { apiRequest } from "@services/api.config";
import ProductoSimpleCard from "./ProductoSimpleCard";
import Paginacion from "@components/common/Paginacion";
import FAB from "@components/common/FAB";
export default function CatalogoProductos({ carga, agregarProducto,
  page,
  totalPages,
  setTotalPages,
  onPageChange,
  size,
  onSizeChange, }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);


  // Cada vez que cambie la página o el tamaño, pedimos de nuevo
  useEffect(() => {
    fetchProductos();
  }, [page, size]);

  async function fetchProductos() {
    setLoading(true);
    try {
      const datos = await apiRequest(
        `productos?page=${page}&size=${size}`,
        null,
        {
          method: "GET",
        },
      );
      setProductos(datos.data.content || []);
      setTotalPages(datos.data?.totalPages || 0);
    } catch (err) {
      console.error("Error cargando productos:", err);
    } finally {
      setLoading(false);
    }
  }

  const getCantidad = (id) =>
    carga.find((i) => i.producto.id === id)?.cantidad || 0;

  if (loading)
    return (
      <div className="text-center py-10 text-white">Cargando catálogo...</div>
    );

  return (
    <div className="w-full">
      <div className="grid w-full justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:6 gap-6">
        {productos.map((prod) => (
          <ProductoSimpleCard
            key={prod.id}
            producto={prod}
            cantidad={getCantidad(prod.id)}
            onAdd={agregarProducto}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Paginacion
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          size={size}
          onSizeChange={onSizeChange}
        />
      )}
    </div>
  );
}
