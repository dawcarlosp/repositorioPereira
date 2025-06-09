import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import ProductoSimpleCard from "../components/productos/ProductoSimpleCard";

export default function Main({ carga, agregarProducto }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Responsive: ¿móvil?
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    setLoading(true);
    apiRequest("productos", null, { method: "GET" })
      .then(setProductos)
      .catch(() => setProductos([]))
      .finally(() => setLoading(false));
  }, []);

  function getCantidad(prodId) {
    const found = carga.find((item) => item.producto.id === prodId);
    return found ? found.cantidad : 0;
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500 py-10">
        Cargando productos...
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="p-4 text-center py-10 text-gray-400 bg-white rounded-xl shadow-lg">
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
      </div>
    );
  }

  // GRID en escritorio/tablet
  return (
    <div className="p-4 max-w-5xl mx-auto">
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
    </div>
  );
}
