// src/hooks/useGestionProductos.js
import { useState } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "@services/api";
import { resolveProductImage } from "@utils/imageUtils";

const FORM_INITIAL = {
  nombre: "",
  precio: "",
  iva: "",
  paisId: "",
  categoriaIds: [],
  foto: null,
  fotoUrlEdicion: null,
};

export default function useGestionProductos({ onSuccess }) {
  const [form, setForm]       = useState(FORM_INITIAL);
  const [editando, setEditando] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [modal, setModal]     = useState({ visible: false });

  const setField = (field) => (value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const abrirNuevo = (paises) => {
    setEditando(null);
    setForm({ ...FORM_INITIAL, paisId: paises[0]?.id ?? "" });
    setShowForm(true);
  };

  const abrirEditar = (prod, paises, categorias) => {
    setEditando(prod);
    setForm({
      nombre:       prod.nombre,
      precio:       prod.precio,
      iva:          prod.iva,
      paisId:       prod.paisId ?? paises.find((p) => p.nombre === prod.paisNombre)?.id ?? "",
      categoriaIds: categorias.filter((c) => (prod.categorias ?? []).includes(c.nombre)).map((c) => c.id),
      foto:         null,
      fotoUrlEdicion: prod.foto ? resolveProductImage(prod.foto) : null,
    });
    setShowForm(true);
  };

  const cerrarForm = () => {
    setShowForm(false);
    setEditando(null);
    setForm(FORM_INITIAL);
  };

  const guardarProducto = async (formData, id, method) => {
    const endpoint = id ? `productos/${id}` : "productos";
    try {
      await apiRequest(endpoint, formData, { method, isFormData: true });
      toast.success(id ? "Producto editado" : "Producto creado");
      cerrarForm();
      onSuccess();
    } catch (err) {
      toast.error(err?.foto ?? err?.error ?? "Error guardando producto");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, precio, paisId, categoriaIds, foto, iva } = form;

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
      precio:       parseFloat(precio),
      iva:          parseFloat(iva),
      paisId:       Number(paisId),
      categoriaIds: categoriaIds.map(Number),
    };

    const formData = new FormData();
    formData.append("producto", new Blob([JSON.stringify(productoDTO)], { type: "application/json" }));
    if (foto) formData.append("foto", foto);

    if (editando) {
      setShowForm(false);
      setModal({
        visible: true,
        mensaje: "¿Guardar cambios de este producto?",
        confirmText: "Guardar cambios",
        onConfirmar: async () => {
          setModal({ visible: false });
          await guardarProducto(formData, editando.id, "PUT");
        },
        onCancelar: () => {
          setModal({ visible: false });
          setShowForm(true);
        },
      });
      return;
    }

    await guardarProducto(formData, null, "POST");
  };

  const pedirConfirmacionEliminar = (id, onSuccess) => {
    setModal({
      visible: true,
      mensaje: "¿Seguro que quieres eliminar este producto?",
      confirmText: "Eliminar",
      onConfirmar: async () => {
        setModal({ visible: false });
        try {
          await apiRequest(`productos/${id}`, null, { method: "DELETE" });
          toast.success("Producto eliminado correctamente.");
          onSuccess();
        } catch (err) {
          if (err?.razon === "EN_VENTA") {
            toast.warn("No puedes eliminar este producto porque ya ha sido vendido.");
          } else {
            toast.error(err?.error ?? "No se pudo eliminar el producto.");
          }
        }
      },
      onCancelar: () => setModal({ visible: false }),
    });
  };

  return {
    form, setField,
    editando, showForm,
    modal, setModal,
    abrirNuevo, abrirEditar, cerrarForm,
    handleSubmit, pedirConfirmacionEliminar,
  };
}