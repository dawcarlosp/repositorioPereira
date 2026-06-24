// src/components/productos/GestionProductos.jsx
import React, { useState } from "react";
import useProductos from "@hooks/useProductos";
import useFiltrosProducto from "@hooks/useFiltrosProducto";
import useGestionProductos from "@hooks/useGestionProductos";
import useBreakpoint from "@hooks/useBreakpoint";
import { isBreakpoint } from "@constants/breakpoints";
import TablaProductos from "@components/products/TablaProductos";
import ProductoGestionCard from "@components/products/ProductoGestionCard";
import ModalProductoForm from "@components/products/ModalProductoForm";
import ModalConfirmacion from "@components/common/ModalConfirmacion";
import Paginacion from "@components/common/Paginacion";
import BuscadorInput from "@components/common/BuscadorInput";
import SelectFiltro from "@components/common/SelectFiltro";
import FAB from "@components/common/FAB";
import Boton from "@buttons/Boton";
import { Donut } from "lucide-react";
import { toast } from "react-toastify";

const SkeletonProductoCard = () => (
  <div className="rounded-2xl bg-zinc-900 border border-zinc-700 flex flex-col gap-3 p-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-3 w-8 bg-zinc-700 rounded" />
      <div className="flex gap-2">
        <div className="h-8 w-14 bg-zinc-700 rounded-xl" />
        <div className="h-8 w-16 bg-zinc-700 rounded-xl" />
      </div>
    </div>
    <div className="h-28 bg-zinc-800 rounded-xl border border-zinc-700/30" />
    <div className="flex flex-col gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex justify-between">
          <div className="h-3 w-16 bg-zinc-700/50 rounded" />
          <div className="h-3 w-24 bg-zinc-700/50 rounded" />
        </div>
      ))}
    </div>
  </div>
);

export default function GestionProductos() {
  const bp = useBreakpoint();
  const isMobile = isBreakpoint(bp, "MOBILE");

  const [page, setPage] = useState(0);
  const [size, setSize]               = useState(10);
  const [search, setSearch]           = useState("");
  const [paisId, setPaisId]           = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const { paises, categorias } = useFiltrosProducto();

  const { productos, loading, totalPages } = useProductos({
    page, size, search,
    paisId:      paisId      ? Number(paisId)      : null,
    categoriaId: categoriaId ? Number(categoriaId) : null,
  });

  const {
    form, setField,
    editando, showForm,
    modal, setModal,
    abrirNuevo, abrirEditar, cerrarForm,
    handleSubmit, pedirConfirmacionEliminar,
  } = useGestionProductos({
    onSuccess: () => setPage(0),
  });

  const handleSearch    = (v)   => { setSearch(v);            setPage(0); };
  const handlePais      = (e)   => { setPaisId(e.target.value);      setPage(0); };
  const handleCategoria = (e)   => { setCategoriaId(e.target.value); setPage(0); };
  const hayFiltros      = search || paisId || categoriaId;

  const paginacion = !loading && totalPages > 1 && (
    <Paginacion
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      size={size}
      onSizeChange={(s) => { setSize(s); setPage(0); }}
    />
  );

  return (
    <>
      {isMobile && (
        <FAB onClick={() => abrirNuevo(paises)} title="Nuevo Producto" icon="+" />
      )}

      {/* Barra de filtros */}
      <div className="flex flex-wrap items-end gap-3 mb-6">
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
        {hayFiltros && (
          <button
            onClick={() => { setSearch(""); setPaisId(""); setCategoriaId(""); setPage(0); }}
            className="text-[11px] text-zinc-500 hover:text-white transition-colors whitespace-nowrap pb-1"
          >
            Limpiar filtros
          </button>
        )}
        {!isMobile && (
          <Boton onClick={() => abrirNuevo(paises)} className="ml-auto">
            + Agregar producto
          </Boton>
        )}
      </div>

      {/* Vista desktop */}
      {!isMobile && (
        <div className="flex flex-col gap-4">
          <TablaProductos
            productos={productos}
            loading={loading}
            size={size}
            onEditar={(p) => abrirEditar(p, paises, categorias)}
            onEliminar={(id) => pedirConfirmacionEliminar(id, () => setPage(0))}
          />
          {paginacion}
        </div>
      )}

      {/* Vista móvil */}
      {isMobile && (
        <div className="flex flex-col gap-4 pb-16">
          {loading
            ? Array.from({ length: size }).map((_, i) => (
                <SkeletonProductoCard key={i} />
              ))
            : productos.length === 0
              ? (
                <div className="py-12 text-center text-zinc-400 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                  {hayFiltros ? "Sin resultados para los filtros aplicados." : "No hay productos registrados."}
                </div>
              )
              : productos.map((p) => (
                  <ProductoGestionCard
                    key={p.id}
                    producto={p}
                    onEditar={() => abrirEditar(p, paises, categorias)}
                    onEliminar={() => pedirConfirmacionEliminar(p.id, () => setPage(0))}
                  />
                ))
          }
          {paginacion}
        </div>
      )}

      <ModalProductoForm
        visible={showForm}
        onClose={cerrarForm}
        onSubmit={handleSubmit}
        editando={editando}
        nombre={form.nombre}             setNombre={setField("nombre")}
        precio={form.precio}             setPrecio={setField("precio")}
        iva={form.iva}                   setIva={setField("iva")}
        paisId={form.paisId}             setPaisId={setField("paisId")}
        categoriaIds={form.categoriaIds} setCategoriaIds={setField("categoriaIds")}
        foto={form.foto}                 setFoto={setField("foto")}
        fotoUrlEdicion={form.fotoUrlEdicion}
        paises={paises}
        categorias={categorias}
      />

      {modal.visible && (
        <ModalConfirmacion
          mensaje={modal.mensaje}
          confirmText={modal.confirmText}
          onConfirmar={modal.onConfirmar}
          onCancelar={modal.onCancelar ?? (() => setModal({ visible: false }))}
        />
      )}
    </>
  );
}