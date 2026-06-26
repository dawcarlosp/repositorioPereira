// src/hooks/useGestionProductos.ts
import { useState } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "@services/api";
import type { SelectOption } from "@domain/ui.types";
import type { Producto } from "@domain/producto.types";

interface FormState {
  nombre:         string;
  precio:         string;
  iva:            string;
  paisId:         number | "";
  categoriaIds:   number[];   // ← siempre number[]
  foto:           File | null;
  fotoUrlEdicion: string | null;
}

interface ModalState {
  visible:      boolean;
  mensaje?:     string;
  confirmText?: string;
  onConfirmar?: () => Promise<void>;
  onCancelar?:  () => void;
}

interface UseGestionProductosOptions {
  onSuccess: () => void;
}

const FORM_INITIAL: FormState = {
  nombre:         "",
  precio:         "",
  iva:            "",
  paisId:         "",
  categoriaIds:   [],
  foto:           null,
  fotoUrlEdicion: null,
};

const API_URL = import.meta.env.VITE_API_URL as string;

export default function useGestionProductos({ onSuccess }: UseGestionProductosOptions) {
  const [form,     setForm]     = useState<FormState>(FORM_INITIAL);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [modal,    setModal]    = useState<ModalState>({ visible: false });

  const setField = <K extends keyof FormState>(field: K) =>
    (value: FormState[K]) => setForm((prev) => ({ ...prev, [field]: value }));

  const abrirNuevo = (paises: SelectOption[]) => {
    setEditando(null);
    setForm({ ...FORM_INITIAL, paisId: paises[0]?.value ?? "" });
    setShowForm(true);
  };

  const abrirEditar = (prod: Producto, paises: SelectOption[], categorias: SelectOption[]) => {
    setEditando(prod);
    const rutaFoto = prod.foto?.includes("/") ? prod.foto : `productos/${prod.foto}`;

    // categoriaIds siempre como number[]
    const categoriaIds: number[] = categorias
      .filter((c) => (prod.categorias ?? []).includes(c.label))
      .map((c) => c.value);

    setForm({
      nombre:         prod.nombre,
      precio:         String(prod.precio),
      iva:            String(prod.iva),
      paisId:         prod.paisId ?? paises.find((p) => p.label === prod.paisNombre)?.value ?? "",
      categoriaIds,
      foto:           null,
      fotoUrlEdicion: prod.foto ? `${API_URL}/imagenes/${rutaFoto}` : null,
    });
    setShowForm(true);
  };

  const cerrarForm = () => {
    setShowForm(false);
    setEditando(null);
    setForm(FORM_INITIAL);
  };

  const guardarProducto = async (formData: FormData, id: number | null, method: string) => {
    const endpoint = id ? `productos/${id}` : "productos";
    try {
      await apiRequest(endpoint, formData, { method, isFormData: true });
      toast.success(id ? "Producto editado" : "Producto creado");
      cerrarForm();
      onSuccess();
    } catch (err: unknown) {
      const e = err as Record<string, string | undefined>;
      toast.error(e?.foto ?? e?.error ?? "Error guardando producto");
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
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
      categoriaIds, // ya son number[]
    };

    const formData = new FormData();
    formData.append(
      "producto",
      new Blob([JSON.stringify(productoDTO)], { type: "application/json" })
    );
    if (foto) formData.append("foto", foto);

    if (editando) {
      setShowForm(false);
      setModal({
        visible:     true,
        mensaje:     "¿Guardar cambios de este producto?",
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

  const pedirConfirmacionEliminar = (id: number, onDeleteSuccess: () => void) => {
    setModal({
      visible:     true,
      mensaje:     "¿Seguro que quieres eliminar este producto?",
      confirmText: "Eliminar",
      onConfirmar: async () => {
        setModal({ visible: false });
        try {
          await apiRequest(`productos/${id}`, null, { method: "DELETE" });
          toast.success("Producto eliminado correctamente.");
          onDeleteSuccess();
        } catch (err: unknown) {
          const er = err as Record<string, string | undefined>;
          if (er?.razon === "EN_VENTA") {
            toast.warn("No puedes eliminar este producto porque ya ha sido vendido.");
          } else {
            toast.error(er?.error ?? "No se pudo eliminar el producto.");
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