import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "../services/api";
import UploadComponent from "../components/vendedor/Form/UploadComponent";
import ModalConfirmacion from "../components/common/ModalConfirmacion";
import Boton from "../components/common/Boton";
import BotonClaro from "../components/common/BotonClaro";

export default function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const [paises, setPaises] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [prod, pais, cat] = await Promise.all([
        apiRequest("productos", null, { method: "GET" }),
        apiRequest("paises", null, { method: "GET" }),
        apiRequest("categorias", null, { method: "GET" }),
      ]);
      setProductos(prod);
      setPaises(pais);
      setCategorias(cat);
    } catch (e) {
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
      setFotoUrlEdicion(
        `http://localhost:8080/imagenes/productos/${prod.foto}`
      );
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

  // FAB botón flotante SOLO EN MÓVIL
  const botonFlotanteMobile = isMobile ? (
    <button
      onClick={abrirNuevo}
      style={{
        position: "fixed",
        bottom: 22,
        right: 22,
        zIndex: 10000000,
        background: "#FF7F50",
        color: "#fff",
        border: "none",
        borderRadius: 999,
        width: 62,
        height: 62,
        fontSize: 42,
        fontWeight: "bold",
        boxShadow: "0 6px 24px #0006",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        outline: "none",
        transition: "background .2s",
      }}
      title="Agregar producto"
      aria-label="Agregar producto"
    >
      +
    </button>
  ) : null;

  return (
    <>
      {botonFlotanteMobile}
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-white to-purple-500 p-2 sm:p-4">
        <div className="max-w-7xl mx-auto rounded-2xl mt-4 sm:mt-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center text-gray-900 drop-shadow">
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
          {showForm && (
            <div className="fixed inset-0 z-[100000] bg-black/70 flex items-center justify-center px-2 sm:px-4">
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-5 sm:p-8 text-center border-4 border-blue-500">
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-xl"
                  onClick={cerrarForm}
                  title="Cerrar"
                >
                  ×
                </button>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <h2 className="text-xl font-bold mb-4 text-purple-600">
                    {editando ? "Editar" : "Agregar"} Producto
                  </h2>
                  {paises.length === 0 && (
                    <div className="bg-red-100 text-red-700 rounded-xl px-4 py-3 mb-4 font-semibold text-center">
                      Para agregar productos primero debes cargar al menos un
                      país.
                    </div>
                  )}
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block mb-1 text-gray-700">Nombre</label>
                      <input
                        className="w-full border-2 border-purple-200 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        disabled={paises.length === 0}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-700">Precio</label>
                      <input
                        className="w-full border-2 border-purple-200 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                        type="number"
                        min="0"
                        step="0.01"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                        disabled={paises.length === 0}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-700">País</label>
                      <select
                        className="w-full border-2 border-purple-200 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                        value={paisId}
                        onChange={(e) => setPaisId(e.target.value)}
                        required
                        disabled={paises.length === 0}
                      >
                        <option value="" disabled>
                          Selecciona un país
                        </option>
                        {paises.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                      {paisId && paises.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          {(() => {
                            const pais = paises.find(
                              (p) => p.id === Number(paisId)
                            );
                            return pais && pais.enlaceFoto ? (
                              <img
                                src={pais.enlaceFoto}
                                alt={pais.nombre}
                                className="w-8 h-6 rounded shadow"
                              />
                            ) : null;
                          })()}
                          <span className="text-sm text-gray-800">
                            {paises.find((p) => p.id === Number(paisId))
                              ?.nombre || ""}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-700">
                        Categoría(s)
                      </label>
                      <select
                        multiple
                        className="w-full border-2 border-purple-200 rounded-lg p-2 h-28 focus:ring-blue-500 focus:border-blue-500"
                        value={categoriaIds.map(String)}
                        onChange={(e) =>
                          setCategoriaIds(
                            Array.from(
                              e.target.selectedOptions,
                              (opt) => opt.value
                            )
                          )
                        }
                        required
                        disabled={paises.length === 0}
                      >
                        {categorias.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
                      <div className="text-xs text-gray-400 mt-1 hidden sm:block">
                        (Ctrl+click para varias)
                      </div>
                      <div className="text-xs text-gray-400 mt-1 sm:hidden">
                        (Toca para seleccionar varias)
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-700">
                        Foto{" "}
                        {editando ? (
                          <span className="text-gray-400">
                            (solo si quieres cambiarla)
                          </span>
                        ) : (
                          <span className="text-orange-500">(obligatoria)</span>
                        )}
                      </label>
                      <UploadComponent
                        setFile={setFoto}
                        file={foto}
                        fotoActualUrl={fotoUrlEdicion}
                        disabled={paises.length === 0}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6 justify-end">
                    <Boton
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold"
                      disabled={paises.length === 0}
                    >
                      Guardar
                    </Boton>
                    <BotonClaro
                      type="button"
                      onClick={cerrarForm}
                      className="font-bold"
                    >
                      Cancelar
                    </BotonClaro>
                  </div>
                </form>
              </div>
            </div>
          )}
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
            <div
              className="rounded-xl shadow-lg p-2"
              style={{
                maxHeight: "55vh",
                minHeight: "160px",
                overflowY: "auto",
                overflowX: "auto",
                background: "#fff8fd",
                border: "2px solid #FF7F50",
                boxShadow: "0 8px 36px #9b51e022",
              }}
            >
              <table className="min-w-[700px] w-full rounded-xl text-sm sm:text-base">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-2 sm:px-4 py-3 text-left whitespace-nowrap">
                      ID
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left whitespace-nowrap">
                      Nombre
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left whitespace-nowrap">
                      Precio
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left whitespace-nowrap">
                      País
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left whitespace-nowrap">
                      Categorías
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left whitespace-nowrap">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p, i) => (
                    <tr
                      key={p.id}
                      className={`
                        ${i % 2 === 0 ? "bg-purple-50" : "bg-white"}
                        border-b border-purple-100
                        hover:bg-orange-100 transition
                      `}
                    >
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-gray-900">
                        {p.id}
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-gray-900">
                        {p.nombre}
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-gray-900">
                        {p.precio}
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {p.paisFoto && (
                            <img
                              src={p.paisFoto}
                              alt={p.paisNombre}
                              className="w-8 h-6 rounded shadow inline-block"
                            />
                          )}
                          <span className="truncate max-w-[60px] text-gray-800">
                            {p.paisNombre || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-gray-900">
                        <span className="truncate block max-w-[90px]">
                          {(p.categorias || []).join(", ")}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 flex flex-col sm:flex-row gap-2 whitespace-nowrap">
                        <BotonClaro
                          className="bg-purple-500 hover:bg-purple-600 text-white font-bold"
                          onClick={() => abrirEditar(p)}
                        >
                          Editar
                        </BotonClaro>
                        <Boton
                          className="bg-orange-500 hover:bg-orange-600 text-white font-bold"
                          onClick={() => confirmarEliminarProducto(p.id)}
                        >
                          Eliminar
                        </Boton>
                      </td>
                    </tr>
                  ))}
                  {productos.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-400">
                        No hay productos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
                <div
                  key={p.id}
                  className="rounded-xl bg-white/95 shadow-lg border-2 border-orange-400 px-4 py-3 flex flex-col gap-2"
                  style={{ minWidth: 0 }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-purple-600 text-lg">#{p.id}</span>
                    <div className="flex gap-2">
                      <BotonClaro
                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-3 py-1"
                        onClick={() => abrirEditar(p)}
                      >
                        Editar
                      </BotonClaro>
                      <Boton
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1"
                        onClick={() => confirmarEliminarProducto(p.id)}
                      >
                        Eliminar
                      </Boton>
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-gray-800">Nombre: </span>
                    <span>{p.nombre}</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-800">Precio: </span>
                    <span>{p.precio}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">País: </span>
                    {p.paisFoto && (
                      <img
                        src={p.paisFoto}
                        alt={p.paisNombre}
                        className="w-8 h-6 rounded shadow"
                      />
                    )}
                    <span>{p.paisNombre}</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-800">Categorías: </span>
                    <span>{(p.categorias || []).join(", ")}</span>
                  </div>
                </div>
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
