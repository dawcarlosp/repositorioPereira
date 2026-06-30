import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "@services/api";
import type { ApiResponse } from "@domain/api.types";
import type { Categoria, CategoriaCreateDTO } from "../domain/categoria.types";

type ModalState =
  | { visible: false }
  | {
      visible: true;
      mensaje: string;
      confirmText: string;
      onConfirmar: () => Promise<void>;
      onCancelar?: () => void;
    };

interface UseGestionCategoriasReturn {
  categorias: Categoria[];
  loading: boolean;
  formNombre: string;
  setFormNombre: (v: string) => void;
  editando: Categoria | null;
  showForm: boolean;
  modal: ModalState;
  setModal: (m: ModalState) => void;
  abrirNuevo: () => void;
  abrirEditar: (c: Categoria) => void;
  cerrarForm: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  pedirConfirmacionEliminar: (id: number) => void;
}

export default function useGestionCategorias(): UseGestionCategoriasReturn {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [formNombre, setFormNombre] = useState("");
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [modal, setModal] = useState<ModalState>({ visible: false });

  const cargarCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiRequest<ApiResponse<Categoria[]>>("categorias", null, { method: "GET" });
      setCategorias(res.data ?? []);
    } catch {
      toast.error("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const abrirNuevo = () => {
    setEditando(null);
    setFormNombre("");
    setShowForm(true);
  };

  const abrirEditar = (c: Categoria) => {
    setEditando(c);
    setFormNombre(c.nombre);
    setShowForm(true);
  };

  const cerrarForm = () => {
    setShowForm(false);
    setEditando(null);
    setFormNombre("");
  };

  const guardar = async (dto: CategoriaCreateDTO, id?: number) => {
    try {
      const endpoint = id ? `categorias/${id}` : "categorias";
      const method = id ? "PUT" : "POST";
      await apiRequest<ApiResponse<Categoria>>(endpoint, dto, { method });
      toast.success(id ? "Categoría actualizada" : "Categoría creada");
      cerrarForm();
      await cargarCategorias();
    } catch (err: unknown) {
      const e = err as Record<string, string | undefined>;
      toast.error(e?.message ?? "Error al guardar la categoría");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nombre = formNombre.trim();
    if (!nombre) {
      toast.error("El nombre es obligatorio");
      return;
    }
    if (editando) {
      setShowForm(false);
      setModal({
        visible: true,
        mensaje: "¿Guardar cambios de esta categoría?",
        confirmText: "Guardar cambios",
        onConfirmar: async () => {
          setModal({ visible: false });
          await guardar({ nombre }, editando.id);
        },
        onCancelar: () => {
          setModal({ visible: false });
          setShowForm(true);
        },
      });
      return;
    }
    await guardar({ nombre });
  };

  const pedirConfirmacionEliminar = async (id: number) => {
    try {
      await apiRequest<ApiResponse<number>>(`categorias/${id}`, null, { method: "DELETE" });
      toast.success("Categoría eliminada");
      await cargarCategorias();
    } catch (err: unknown) {
      const e = err as Partial<ApiResponse<number>>;
      const productCount = e?.data ?? 0;
      if (productCount > 0) {
        setModal({
          visible: true,
          mensaje: `Esta categoría tiene ${productCount} producto${productCount === 1 ? "" : "s"} asociado${productCount === 1 ? "" : "s"}. ¿Qué deseas hacer?`,
          confirmText: "Borrar categoría y productos",
          onConfirmar: async () => {
            setModal({ visible: false });
            try {
              await apiRequest(`categorias/${id}/force`, null, { method: "DELETE" });
              toast.success("Categoría y productos eliminados");
              await cargarCategorias();
            } catch {
              toast.error("Error al eliminar categoría y productos");
            }
          },
          onCancelar: () => setModal({ visible: false }),
        });
        return;
      }
      toast.error(e?.message ?? "Error al eliminar la categoría");
    }
  };

  return {
    categorias, loading,
    formNombre, setFormNombre,
    editando, showForm,
    modal, setModal,
    abrirNuevo, abrirEditar, cerrarForm,
    handleSubmit, pedirConfirmacionEliminar,
  };
}
