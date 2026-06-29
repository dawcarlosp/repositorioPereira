import { useState, useEffect } from "react";
import type { Producto } from "../domain/producto.types";
import type { CarritoItem } from "@features/ventas/hooks/useCarrito";
import ProductoCard from "./ProductoCard";
import SkeletonProductoCard from "@components/common/SkeletonProductoCard";
import Paginacion from "@components/common/Paginacion";
import BuscadorInput from "@components/common/BuscadorInput";
import SelectFilter from "@components/common/SelectFilter";
import useProductos from "../hooks/useProductos";
import useFiltrosProducto from "../hooks/useFiltrosProducto";

const SKELETON_COUNT = 12;

interface Props {
  carga:         CarritoItem[];
  agregarProducto: (p: Producto) => void;
  page:          number;
  setTotalPages: (n: number) => void;
  onPageChange:  (n: number) => void;
  size:          number;
  onSizeChange:  (n: number) => void;
}

export default function CatalogoProductos({
  carga,
  agregarProducto,
  page,
  setTotalPages,
  onPageChange,
  size,
  onSizeChange,
}: Props) {
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

  useEffect(() => {
    setTotalPages(totalPages);
  }, [totalPages, setTotalPages]);

  const getCantidad = (id: number) =>
    carga.find((i) => i.producto.id === id)?.cantidad ?? 0;

  const handleSearch = (v: string) => { setSearch(v); onPageChange(0); };
  const handlePais = (value: string) => { setPaisId(value); onPageChange(0); };
  const handleCategoria = (value: string) => { setCategoriaId(value); onPageChange(0); };

  return (
    <div className="w-full flex flex-col gap-4">

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <BuscadorInput
            value={search}
            onChange={handleSearch}
            placeholder="Buscar producto..."
          />
        </div>

        <div className="w-44">
          <SelectFilter
            id="filtro-pais"
            value={paisId}
            onChange={handlePais}
            placeholder="País"
            options={paises}
            searchPlaceholder="Buscar país..."
          />
        </div>

        <div className="w-44">
          <SelectFilter
            id="filtro-categoria"
            value={categoriaId}
            onChange={handleCategoria}
            placeholder="Categoría"
            options={categorias}
            searchPlaceholder="Buscar categoría..."
          />
        </div>

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
