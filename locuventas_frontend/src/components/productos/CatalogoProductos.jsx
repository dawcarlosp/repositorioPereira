// src/components/productos/CatalogoProductos.jsx
import React, { useState, useEffect } from "react";
import ProductoCard from "./ProductoCard";
import SkeletonProductoCard from "@components/common/SkeletonProductoCard";
import Paginacion from "@components/common/Paginacion";
import BuscadorInput from "@components/common/BuscadorInput";
import SelectFiltro from "@components/common/SelectFiltro";
import useProductos from "@hooks/useProductos";
import useFiltrosProducto from "@hooks/useFiltrosProducto";

const SKELETON_COUNT = 12;

export default function CatalogoProductos({
  carga,
  agregarProducto,
  page,
  setTotalPages,
  onPageChange,
  size,
  onSizeChange,
}) {
  const [search, setSearch] = useState("");
  const [paisId, setPaisId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const { paises, categorias } = useFiltrosProducto();

  const { productos, loading, totalPages } = useProductos({
    page,
    size,
    search,
    paisId: paisId ? Number(paisId) : null,
    categoriaId: categoriaId ? Number(categoriaId) : null,
  });

  // Sincronizar totalPages al padre (Dashboard)
  useEffect(() => {
    setTotalPages(totalPages);
  }, [totalPages]);

  const getCantidad = (id) =>
    carga.find((i) => i.producto.id === id)?.cantidad ?? 0;

  // Al cambiar cualquier filtro, volver a página 0
  const handleSearch = (v) => { setSearch(v); onPageChange(0); };
  const handlePais = (e) => { setPaisId(e.target.value); onPageChange(0); };
  const handleCategoria = (e) => { setCategoriaId(e.target.value); onPageChange(0); };

  return (
    <div className="w-full flex flex-col gap-4">

      {/* Barra de filtros */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Buscador — ocupa el espacio disponible */}
        <div className="flex-1 min-w-[200px]">
          <BuscadorInput
            value={search}
            onChange={handleSearch}
            placeholder="Buscar producto..."
          />
        </div>

        <div className="w-44">
          <SelectFiltro
            id="filtro-pais"
            value={paisId}
            onChange={handlePais}
            placeholder="País"
            options={paises}
            searchPlaceholder="Buscar país..."
          />
        </div>

        <div className="w-44">
          <SelectFiltro
            id="filtro-categoria"
            value={categoriaId}
            onChange={handleCategoria}
            placeholder="Categoría"
            options={categorias}
            searchPlaceholder="Buscar categoría..."
          />
        </div>

        {/* Limpiar filtros — solo visible si hay algo activo */}
        {(search || paisId || categoriaId) && (
          <button
            onClick={() => {
              setSearch("");
              setPaisId("");
              setCategoriaId("");
              onPageChange(0);
            }}
            className="text-[11px] text-zinc-500 hover:text-white transition-colors whitespace-nowrap pb-1"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Grid de productos */}
      <div className="grid w-full justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {loading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <SkeletonProductoCard key={i} />
          ))
          : productos.length === 0
            ? (
              <div className="col-span-full text-center py-20 text-zinc-600 italic text-sm">
                Sin resultados
              </div>
            )
            : productos.map((prod) => (
              <ProductoCard
                key={prod.id}
                producto={prod}
                cantidad={getCantidad(prod.id)}
                onAdd={agregarProducto}
              />
            ))
        }
      </div>

      {/* Paginación */}
      {!loading && totalPages > 1 && (
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