import type { Producto } from "../domain/producto.types";
import Button from "@buttons/Button";
import { resolveProductImage } from "@utils/imageUtils";

interface Props {
  producto:   Producto;
  onEditar:   (p: Producto) => void;
  onEliminar: (id: number) => void;
}

export default function ProductoGestionCard({ producto, onEditar, onEliminar }: Props) {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-700 flex flex-col gap-3 p-4 transition-all duration-200 hover:border-zinc-600">

      <div className="flex justify-between items-center">
        <span className="font-black text-zinc-500 text-sm">#{producto.id}</span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="!h-8 !text-[11px] !px-3"
            onClick={() => onEditar(producto)}
          >
            Editar
          </Button>
          <Button
            variant="secondary"
            className="!h-8 !text-[11px] !px-3 !text-rose-400 hover:!text-rose-300"
            onClick={() => onEliminar(producto.id)}
          >
            Eliminar
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center h-28 bg-zinc-800/50 rounded-xl border border-zinc-700/30 overflow-hidden">
        {producto.foto ? (
          <img
            src={resolveProductImage(producto.foto)}
            alt={producto.nombre}
            className="h-24 w-auto object-contain"
          />
        ) : (
          <span className="text-zinc-600 text-xs italic">Sin imagen</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 text-xs text-zinc-400">
        <div className="flex justify-between items-start gap-2">
          <span>Nombre</span>
          <span className="text-white font-semibold text-right break-words max-w-[60%]">
            {producto.nombre}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Precio</span>
          <span className="text-orange-400 font-black text-sm">
            {producto.precio?.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>País</span>
          <div className="flex items-center gap-1.5">
            {producto.paisFoto && (
              <img
                src={producto.paisFoto}
                alt={producto.paisNombre}
                className="w-6 h-4 rounded-sm object-cover"
              />
            )}
            <span className="text-zinc-200">{producto.paisNombre ?? "-"}</span>
          </div>
        </div>

        <div className="flex justify-between items-start gap-2">
          <span className="flex-shrink-0">Categorías</span>
          <div className="flex flex-wrap justify-end gap-1">
            {(producto.categorias ?? []).map((cat) => (
              <span
                key={cat}
                className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
