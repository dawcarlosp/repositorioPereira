import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import ProductoSimpleCard from "../components/productos/ProductoSimpleCard";
import Paginacion from "../components/common/Paginacion"; // Reutiliza el paginador de ventas

export default function Main({ carga, agregarProducto }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(12); // o el tamaño de página que prefieras
  const [totalPages, setTotalPages] = useState(0);

  // Responsive: ¿móvil?
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    fetchProductos(page, size);
    // eslint-disable-next-line
  }, [page, size]);

  async function fetchProductos(p = page, s = size) {
    setLoading(true);
    try {
      const datos = await apiRequest(`productos?page=${p}&size=${s}`, null, { method: "GET" });
      setProductos(datos.content || []);
      setTotalPages(datos.totalPages || 0);
      setPage(datos.pageNumber || 0);
    } catch {
      setProductos([]);
    }
    setLoading(false);
  }

  function getCantidad(prodId) {
    const found = carga.find((item) => item.producto.id === prodId);
    return found ? found.cantidad : 0;
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-white py-10">
        Cargando productos...
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="p-4 text-center py-10 text-white rounded-xl shadow-lg">
        No hay productos
      </div>
    );
  }

  // MODO CARDS en móvil
  if (isMobile) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Selecciona productos
        </h2>
        <div className="flex flex-col gap-4">
          {productos.map((producto) => (
            <div
              key={producto.id}
              tabIndex={0}
              role="button"
              onClick={() => agregarProducto(producto)}
              className="relative focus:outline-none"
            >
              <ProductoSimpleCard
                producto={producto}
                cantidad={getCantidad(producto.id)}
              />
              {getCantidad(producto.id) > 0 && (
                <span className="absolute top-1 right-2 bg-orange-500 text-white rounded-full px-2 text-xs font-bold shadow">
                  {getCantidad(producto.id)}
                </span>
              )}
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <Paginacion page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>
    );
  }

  // GRID en escritorio/tablet
  return (
    <div className="p-4 max-w-5xl mx-auto h-80">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        Selecciona productos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div
            key={producto.id}
            tabIndex={0}
            role="button"
            onClick={() => agregarProducto(producto)}
            className="relative focus:outline-none"
          >
            <ProductoSimpleCard
              producto={producto}
              cantidad={getCantidad(producto.id)}
            />
            {getCantidad(producto.id) > 0 && (
              <span className="absolute top-1 right-2 bg-orange-500 text-white rounded-full px-2 text-xs font-bold shadow">
                {getCantidad(producto.id)}
              </span>
            )}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <Paginacion page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
