import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "../../services/api";
import ModalConfirmacion from "../common/ModalConfirmacion";
import Boton from "../common/Boton";
import ProductoCard from "./ProductoCard";
import TablaProductos from "./TablaProductos";
import ModalProductoForm from "./ModalProductoForm";
import FabAgregarProducto from "../productos/FabAgregarProducto"; // <-- Aquí importas el FAB
import Paginacion from "../common/Paginacion";
const API_URL = import.meta.env.VITE_API_URL;

export default function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const [paises, setPaises] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  // PAGINACIÓN
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  // Formulario
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [paisId, setPaisId] = useState("");
  const [categoriaIds, setCategoriaIds] = useState([]);
  const [foto, setFoto] = useState(null);
  const [fotoUrlEdicion, setFotoUrlEdicion] = useState(null);
  const fileInputRef = useRef();

  // Modal de confirmación
  const [modal, setModal] = useState({
    visible: false,
    mensaje: "",
    confirmText: "",
    onConfirmar: null,
    onCancelarCustom: null,
  });

  // Detecta móvil
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

    setPaisId(
      prod.paisId || paises.find((p) => p.nombre === prod.paisNombre)?.id || ""
    );

    const selectedIds = categorias
      .filter((c) => (prod.categorias || []).includes(c.nombre))
      .map((c) => c.id);
    setCategoriaIds(selectedIds);

    setFoto(null);

    if (prod.foto) {
      setFotoUrlEdicion(`${API_URL}/imagenes/productos/${prod.foto}`);
    } else {
      setFotoUrlEdicion(null);
    }
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

  // Confirmación para eliminar
  function confirmarEliminarProducto(id) {
    setModal({
      visible: true,
      mensaje: "¿Seguro que quieres eliminar este producto?",
      confirmText: "Eliminar",
      onConfirmar: async () => {
        setModal((m) => ({ ...m, visible: false }));
        try {
          await apiRequest(`productos/${id}`, null, { method: "DELETE" });
          toast.success("Producto eliminado");
          fetchData();
        } catch {
          toast.error("No se pudo eliminar");
        }
      },
      onCancelarCustom: null,
    });
  }

  // Guardar producto (alta o edición)
  async function guardarProducto(formData, id, method) {
    let endpoint = "productos";
    if (id) endpoint += `/${id}`;

    try {
      await apiRequest(endpoint, formData, { method, isFormData: true });
      toast.success(id ? "Producto editado" : "Producto creado");
      cerrarForm();
      fetchData();
    } catch {
      toast.error("Error guardando producto");
    }
  }

  // Al enviar el formulario
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
      paisId: Number(paisId),
      categoriaIds: categoriaIds.map(Number),
    };

    const formData = new FormData();
    formData.append("producto", JSON.stringify(productoDTO));
    if (foto) formData.append("foto", foto);

    // Confirmación SOLO al editar
    if (editando) {
      setShowForm(false); // Oculta el formulario, para que el modal se vea encima
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
          setShowForm(true); // Reabre el formulario si cancela
        },
      });
      return;
    }

    // Alta directa
    await guardarProducto(formData, null, "POST");
  }

  // FAB botón flotante SOLO EN MÓVIL (usando componente)
  const botonFlotanteMobile = isMobile ? (
    <FabAgregarProducto onClick={abrirNuevo} />
  ) : null;

  // Map de banderas para paises (por si lo necesitas)
  const flagMap = {};
  paises.forEach((p) => (flagMap[p.id] = p.enlaceFoto));

  return (
    <>
      {botonFlotanteMobile}
      <div className="min-h-screen bg-zinc-900 p-2 sm:p-4">
        <div className="max-w-7xl mx-auto rounded-2xl mt-4 sm:mt-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center text-white drop-shadow">
            Gestión de Productos
          </h1>
          {/* Botón escritorio */}
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

          {/* MODAL formulario */}
          <ModalProductoForm
            visible={showForm}
            onClose={cerrarForm}
            onSubmit={handleSubmit}
            editando={editando}
            nombre={nombre}
            setNombre={setNombre}
            precio={precio}
            setPrecio={setPrecio}
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

          {/* Modal confirmación */}
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

          {/* TABLA EN ESCRITORIO / CARDS EN MÓVIL */}
          {!isMobile && (
            <>
              <TablaProductos
                productos={productos}
                onEditar={abrirEditar}
                onEliminar={confirmarEliminarProducto}
              />
              {/* PAGINACIÓN abajo de la tabla */}
              {totalPages > 1 && (
                <Paginacion
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}

          {/* CARDS EN MÓVIL */}
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
                  onEliminar={confirmarEliminarProducto}
                />
              ))}
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
