import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "@/services/api";
import ModalConfirmacion from "@components/common/ModalConfirmacion";
import Boton from "@components/common/Boton";
import ProductoCard from "@components/productos/ProductoCard";
import TablaProductos from "@components/productos/TablaProductos";
import ModalProductoForm from "@components/productos/ModalProductoForm";
import FabAgregarProducto from "@components/productos/FabAgregarProducto";
import Paginacion from "@components/common/Paginacion";

const API_URL = import.meta.env.VITE_API_URL;

export default function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const [paises, setPaises] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [iva, setIva] = useState("");
  const [paisId, setPaisId] = useState("");
  const [categoriaIds, setCategoriaIds] = useState([]);
  const [foto, setFoto] = useState(null);
  const [fotoUrlEdicion, setFotoUrlEdicion] = useState(null);
  const fileInputRef = useRef();

  const [modal, setModal] = useState({
    visible: false,
    mensaje: "",
    confirmText: "",
    onConfirmar: null,
    onCancelarCustom: null,
  });

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 640
  );

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, size]);

  async function fetchData() {
    setLoading(true);
    try {
      const [prodPage, pais, cat] = await Promise.all([
        apiRequest(`productos?page=${page}&size=${size}`, null, {
          method: "GET",
        }),
        apiRequest("paises", null, { method: "GET" }),
        apiRequest("categorias", null, { method: "GET" }),
      ]);
      setProductos(prodPage.content || []);
      setTotalPages(prodPage.totalPages || 0);
      setPage(prodPage.pageNumber || 0);
      setPaises(pais);
      setCategorias(cat);
    } catch {
      toast.error("Error cargando datos.");
    }
    setLoading(false);
  }

  function abrirNuevo() {
    setEditando(null);
    setNombre("");
    setPrecio("");
    setIva("");
    setPaisId(paises[0]?.id || "");
    setCategoriaIds([]);
    setFoto(null);
    setFotoUrlEdicion(null);
    setShowForm(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function abrirEditar(prod) {
    setEditando(prod);
    setNombre(prod.nombre);
    setPrecio(prod.precio);
    setIva(prod.iva);
    setPaisId(
      prod.paisId || paises.find((p) => p.nombre === prod.paisNombre)?.id || ""
    );
    const selectedIds = categorias
      .filter((c) => (prod.categorias || []).includes(c.nombre))
      .map((c) => c.id);
    setCategoriaIds(selectedIds);
    setFoto(null);
    const rutaFoto = prod.foto?.includes("/")
      ? prod.foto
      : `productos/${prod.foto}`;
    setFotoUrlEdicion(prod.foto ? `${API_URL}/imagenes/${rutaFoto}` : null);

    setShowForm(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function cerrarForm() {
    setShowForm(false);
    setFoto(null);
    setEditando(null);
    setFotoUrlEdicion(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
  const onEliminar = (id) => {
    setModal({
      visible: true,
      mensaje: "¿Seguro que quieres eliminar este producto?",
      confirmText: "Eliminar",
      onConfirmar: async () => {
        setModal((m) => ({ ...m, visible: false }));
        try {
          await apiRequest(`productos/${id}`, null, { method: "DELETE" });
          toast.success("Producto eliminado correctamente.");
          fetchData();
        } catch (error) {
          if (error.razon === "EN_VENTA") {
            toast.warn(
              "No puedes eliminar este producto porque ya ha sido vendido. Consulta las ventas asociadas o marca el producto como inactivo."
            );
          } else if (error.error) {
            toast.error(error.error);
          } else {
            toast.error("No se pudo eliminar el producto.");
          }
        }
      },
      onCancelarCustom: () => setModal((m) => ({ ...m, visible: false })),
    });
  };

  async function guardarProducto(formData, id, method) {
    let endpoint = "productos";
    if (id) endpoint += `/${id}`;
    try {
      await apiRequest(endpoint, formData, { method, isFormData: true });
      toast.success(id ? "Producto editado" : "Producto creado");
      cerrarForm();
      fetchData();
    } catch (err) {
      if (err.foto) {
        toast.error(err.foto);
      } else if (err.error) {
        toast.error(err.error);
      } else {
        toast.error("Error guardando producto");
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre || !precio || !paisId || categoriaIds.length === 0) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    if (!editando && !foto) {
      toast.error("La foto es obligatoria");
      return;
    }

    const productoDTO = {
      nombre,
      precio: parseFloat(precio),
      iva: parseFloat(iva),
      paisId: Number(paisId),
      categoriaIds: categoriaIds.map(Number),
    };

    const formData = new FormData();
    formData.append("producto", JSON.stringify(productoDTO));
    if (foto) formData.append("foto", foto);

    if (editando) {
      setShowForm(false);
      setModal({
        visible: true,
        mensaje: "¿Guardar cambios de este producto?",
        confirmText: "Guardar cambios",
        onConfirmar: async () => {
          setModal((m) => ({ ...m, visible: false }));
          await guardarProducto(formData, editando.id, "PUT");
        },
        onCancelarCustom: () => {
          setModal((m) => ({ ...m, visible: false }));
          setShowForm(true);
        },
      });
      return;
    }

    await guardarProducto(formData, null, "POST");
  }

  const botonFlotanteMobile = isMobile ? (
    <FabAgregarProducto onClick={abrirNuevo} />
  ) : null;

  return (
    <>
      {botonFlotanteMobile}
      <div className="min-h-screen bg-zinc-900 p-2 sm:p-4">
        <div className="max-w-7xl mx-auto rounded-2xl mt-4 sm:mt-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center text-white drop-shadow">
            Gestión de Productos
          </h1>

          <div className="mb-4 flex justify-end">
            {!isMobile && (
              <Boton
                className="bg-orange-400 hover:bg-orange-500 text-white font-bold"
                onClick={abrirNuevo}
              >
                + Agregar producto
              </Boton>
            )}
          </div>

          <ModalProductoForm
            visible={showForm}
            onClose={cerrarForm}
            onSubmit={handleSubmit}
            editando={editando}
            nombre={nombre}
            setNombre={setNombre}
            precio={precio}
            setPrecio={setPrecio}
            iva={iva}
            setIva={setIva}
            paisId={paisId}
            setPaisId={setPaisId}
            categoriaIds={categoriaIds}
            setCategoriaIds={setCategoriaIds}
            foto={foto}
            setFoto={setFoto}
            fotoUrlEdicion={fotoUrlEdicion}
            paises={paises}
            categorias={categorias}
            fileInputRef={fileInputRef}
          />

          {modal.visible && (
            <ModalConfirmacion
              mensaje={modal.mensaje}
              confirmText={modal.confirmText}
              onConfirmar={modal.onConfirmar}
              onCancelar={
                modal.onCancelarCustom
                  ? modal.onCancelarCustom
                  : () => setModal((m) => ({ ...m, visible: false }))
              }
            />
          )}

          {!isMobile && (
            <>
              <TablaProductos
                productos={productos}
                onEditar={abrirEditar}
                onEliminar={onEliminar}
              />
              {totalPages > 1 && (
                <Paginacion
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}

          {isMobile && (
            <div className="flex flex-col gap-4 pb-12">
              {productos.length === 0 && (
                <div className="py-8 text-center text-gray-400 bg-white rounded-xl shadow-lg">
                  No hay productos
                </div>
              )}
              {productos.map((p) => (
                <ProductoCard
                  key={p.id}
                  producto={p}
                  onEditar={abrirEditar}
                  onEliminar={onEliminar}
                />
              ))}
               {totalPages > 1 && (
      <div className="mt-4">
        <Paginacion
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    )}
            </div>
          )}

          {loading && (
            <div className="text-center py-6 text-gray-500">
              Cargando productos...
            </div>
          )}
        </div>
      </div>
    </>
  );
}
