import TablaLayout from "@components/common/TablaLayout";
import Boton from "@components/common/Boton";

const API_URL = import.meta.env.VITE_API_URL;
const resolverRutaFoto = (foto) => (!foto ? null : foto.includes("/") ? foto : `productos/${foto}`);

export default function TablaProductos({ productos, onEditar, onEliminar, paginaActual, totalPaginas, onPageChange }) {
  const columnas = [
    { label: "ID" },
    { label: "Foto" },
    { label: "Nombre" },
    { label: "Precio" },
    { label: "País" },
    { label: "Categorías" },
    { label: "Acciones", className: "text-right" }
  ];

  return (
    <TablaLayout 
      columnas={columnas}
      paginaActual={paginaActual}
      totalPaginas={totalPaginas}
      onPageChange={onPageChange}
    >
      {productos.length === 0 ? (
        <tr><td colSpan={7} className="py-20 text-center text-zinc-500 italic">No hay productos</td></tr>
      ) : (
        productos.map((p) => (
          <tr key={p.id} className="hover:bg-zinc-700/30 transition-colors group text-zinc-300">
            <td className="px-4 py-4">#{p.id}</td>
            <td className="px-4 py-4">
               {p.foto ? (
                  <img src={`${API_URL}/imagenes/${resolverRutaFoto(p.foto)}`} className="w-12 h-10 object-cover rounded border border-zinc-700" />
               ) : "Sin foto"}
            </td>
            <td className="px-4 py-4 font-medium text-white">{p.nombre}</td>
            <td className="px-4 py-4 font-bold text-orange-400">{p.precio}€</td>
            <td className="px-4 py-4">{p.paisNombre || "-"}</td>
            <td className="px-4 py-4">
                {/* Tus etiquetas de categorías aquí */}
            </td>
            <td className="px-4 py-4">
               <div className="flex justify-end gap-2">
                 <Boton onClick={() => onEditar(p)} className="!px-3 !py-1 w-auto text-xs">Editar</Boton>
                 <Boton onClick={() => onEliminar(p.id)} className="!px-3 !py-1 w-auto text-xs !ring-rose-500">Eliminar</Boton>
               </div>
            </td>
          </tr>
        ))
      )}
    </TablaLayout>
  );
}