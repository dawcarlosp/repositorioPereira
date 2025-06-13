import Boton from "@components/common/Boton";
import BotonClaro from "@components/common/BotonClaro";
const API_URL = import.meta.env.VITE_API_URL;
function resolverRutaFoto(foto) {
  if (!foto) return null;
  return foto.includes("/") ? foto : `productos/${foto}`;
}
export default function ProductoCard({
  producto,
  onEditar,
  onEliminar,
}) {
  return (
    <div
      className="rounded-xl bg-white/95 shadow-lg border-2 border-orange-400 flex flex-col px-4 py-3 gap-2
        w-full min-h-[350px] max-h-[370px] min-w-[220px] max-w-[300px]
        transition-all duration-200 box-border"
      style={{ boxSizing: "border-box" }}
    >
      {/* Top: ID y acciones */}
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-purple-600 text-lg">#{producto.id}</span>
        <div className="flex gap-2">
          <BotonClaro
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-3 py-1"
            onClick={() => onEditar(producto)}
          >
            Editar
          </BotonClaro>
          <Boton
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1"
            onClick={() => onEliminar(producto.id)}
          >
            Eliminar
          </Boton>
        </div>
      </div>

      {/* Imagen */}
      <div className="flex justify-center items-center my-2 min-h-[96px] h-[96px]">
        {producto.foto ? (
          <img
           src={`${API_URL}/imagenes/${resolverRutaFoto(producto.foto)}`}
            alt={producto.nombre}
            className="h-24 w-auto rounded-lg shadow-md object-contain bg-[#fafafa]"
            style={{ maxWidth: "90%" }}
          />
        ) : (
          <div className="h-20 w-20 bg-white-100 rounded-lg flex items-center justify-center text-zinc-400 text-xs">
            Sin imagen
          </div>
        )}
      </div>

      {/* Área scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex flex-col gap-1 pr-1">
          <div>
            <span className="font-bold text-zinc-800">Nombre: </span>
            <span className="text-zinc-700 break-words">{producto.nombre}</span>
          </div>
          <div>
            <span className="font-bold text-zinc-800">Precio: </span>
            <span className="text-zinc-700">{producto.precio}€</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-800">País: </span>
            {producto.paisFoto && (
              <img
                src={producto.paisFoto}
                alt={producto.paisNombre}
                className="w-8 h-6 rounded shadow"
              />
            )}
            <span className="text-zinc-700">{producto.paisNombre}</span>
          </div>
          <div>
            <span className="font-bold text-zinc-800">Categorías: </span>
            <span className="text-zinc-700 break-words">{(producto.categorias || []).join(", ")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
