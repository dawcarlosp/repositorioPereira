import useGestionCategorias from "../hooks/useGestionCategorias";
import ModalConfirmacion from "@components/common/ModalConfirmacion";
import Button from "@buttons/Button";
import BaseModal from "@components/common/BaseModal";

export default function GestionCategorias() {
  const {
    categorias, loading,
    formNombre, setFormNombre,
    showForm, editando,
    modal, setModal,
    abrirNuevo, abrirEditar, cerrarForm,
    handleSubmit, pedirConfirmacionEliminar,
  } = useGestionCategorias();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-zinc-400 text-sm">
          {loading ? "Cargando..." : `${categorias.length} categoría${categorias.length === 1 ? "" : "s"}`}
        </p>
        <Button onClick={abrirNuevo}>+ Nueva categoría</Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-zinc-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : categorias.length === 0 ? (
        <div className="py-12 text-center text-zinc-400 bg-zinc-800/50 rounded-2xl border border-zinc-700">
          No hay categorías registradas.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-800/80 text-zinc-400 uppercase text-[11px] tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Nombre</th>
                <th className="text-center px-5 py-3 font-medium w-28">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700">
              {categorias.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-3 text-white font-medium">{c.nombre}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => abrirEditar(c)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => pedirConfirmacionEliminar(c.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-300 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <BaseModal title={formNombre ? "Editar categoría" : "Nueva categoría"} onClose={cerrarForm}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Nombre</label>
              <input
                value={formNombre}
                onChange={(e) => setFormNombre(e.target.value)}
                placeholder="Nombre de la categoría"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                autoFocus
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">
                {editando ? "Guardar cambios" : "Crear categoría"}
              </Button>
              <Button type="button" variant="secondary" onClick={cerrarForm} className="flex-1">
                Cancelar
              </Button>
            </div>
          </form>
        </BaseModal>
      )}

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
