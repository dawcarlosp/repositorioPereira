// src/components/productos/TablaProductos.jsx
import TablaLayout from "@components/common/TablaLayout";
import Boton from "@buttons/Boton";

const API_URL = import.meta.env.VITE_API_URL;
const resolverRutaFoto = (foto) =>
  !foto ? null : foto.includes("/") ? foto : `productos/${foto}`;

const columnas = [
  { label: "ID" },
  { label: "Foto" },
  { label: "Nombre" },
  { label: "Precio" },
  { label: "País" },
  { label: "Categorías" },
  { label: "Acciones", className: "text-right" },
];

export default function TablaProductos({
  productos,
  loading,
  size,
  onEditar,
  onEliminar,
}) {
  return (
    <TablaLayout columnas={columnas} loading={loading} size={size}>
      {productos.length === 0 ? (
        <tr>
          <td colSpan={7} className="py-20 text-center text-zinc-500 italic">
            No hay productos
          </td>
        </tr>
      ) : (
        productos.map((p) => (
          <tr
            key={p.id}
            className="hover:bg-zinc-700/30 transition-colors group text-zinc-300"
          >
            <td className="px-4 py-4 text-zinc-500 font-medium">#{p.id}</td>

            <td className="px-4 py-4">
              {p.foto ? (
                <img
                  src={`${API_URL}/imagenes/${resolverRutaFoto(p.foto)}`}
                  alt={p.nombre}
                  className="w-12 h-10 object-cover rounded-lg border border-zinc-700"
                />
              ) : (
                <div className="w-12 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-600 text-[10px]">
                  Sin foto
                </div>
              )}
            </td>

            <td className="px-4 py-4 font-semibold text-white">{p.nombre}</td>

            <td className="px-4 py-4 font-black text-orange-400 whitespace-nowrap">
              {p.precio?.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
            </td>

            <td className="px-4 py-4">
              <div className="flex items-center gap-2">
                {p.paisFoto && (
                  <img
                    src={p.paisFoto}
                    alt={p.paisNombre}
                    className="w-6 h-4 rounded-sm object-cover"
                  />
                )}
                <span className="text-zinc-400 text-sm">{p.paisNombre ?? "-"}</span>
              </div>
            </td>

            <td className="px-4 py-4">
              <div className="flex flex-wrap gap-1">
                {(p.categorias ?? []).map((cat) => (
                  <span
                    key={cat}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </td>

            <td className="px-4 py-4">
              <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                <Boton
                  onClick={() => onEditar(p)}
                  className="!px-3 !py-1 w-auto text-xs"
                >
                  Editar
                </Boton>
                <Boton
                  onClick={() => onEliminar(p.id)}
                  className="!px-3 !py-1 w-auto text-xs !ring-rose-500 hover:!bg-rose-500"
                >
                  Eliminar
                </Boton>
              </div>
            </td>
          </tr>
        ))
      )}
    </TablaLayout>
  );
}