import Boton from "../common/Boton";
import BotonClaro from "../common/BotonClaro";
import { normalizaMultiValor } from "../../services/normalizaMultiValor"; // Importa la función

const API_URL = import.meta.env.VITE_API_URL;

export default function TablaProductos({ productos, onEditar, onEliminar }) {
  return (
    <div
      className="overflow-x-auto rounded-xl shadow-lg p-2"
      style={{
        maxHeight: "55vh",
        minHeight: "160px",
        background: "#fff8fd",
        border: "2px solid #FF7F50",
        boxShadow: "0 8px 36px #9b51e022",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <style>
        {`
          div::-webkit-scrollbar {
            height: 8px;
          }
          div::-webkit-scrollbar-thumb {
            background: #ffb68e;
            border-radius: 8px;
          }
        `}
      </style>
      <table className="w-max min-w-full rounded-xl text-sm sm:text-base">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-2 sm:px-4 py-3 text-left whitespace-nowrap sticky top-0 bg-blue-500 z-10">
              ID
            </th>
            <th className="px-2 sm:px-4 py-3 text-left whitespace-nowrap sticky top-0 bg-blue-500 z-10">
              Foto
            </th>
            <th className="px-2 sm:px-4 py-3 text-left whitespace-nowrap sticky top-0 bg-blue-500 z-10">
              Nombre
            </th>
            <th className="px-2 sm:px-4 py-3 text-left whitespace-nowrap sticky top-0 bg-blue-500 z-10">
              Precio
            </th>
            <th className="px-2 sm:px-4 py-3 text-left whitespace-nowrap sticky top-0 bg-blue-500 z-10">
              País
            </th>
            <th className="px-2 sm:px-4 py-3 text-left whitespace-nowrap sticky top-0 bg-blue-500 z-10">
              Categorías
            </th>
            <th className="px-2 sm:px-4 py-3 text-left whitespace-nowrap sticky top-0 bg-blue-500 z-10">
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
                hover:bg-purple-100 transition
              `}
            >
              <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-zinc-900">
                {p.id}
              </td>
              <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                {p.foto ? (
                  <img
                    src={`${API_URL}/imagenes/productos/${p.foto}`}
                    alt={p.nombre}
                    className="w-14 h-10 object-cover rounded shadow border border-zinc-200"
                  />
                ) : (
                  <span className="text-zinc-300">Sin foto</span>
                )}
              </td>
              <td className="px-2 sm:px-4 py-3 text-zinc-900 align-top">
                <span className="block break-words">
                  {p.nombre}
                </span>
              </td>
              <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-zinc-900">
                {p.precio}€
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
                  <span className="text-zinc-800 whitespace-nowrap">
                    {p.paisNombre || "-"}
                  </span>
                </div>
              </td>
              <td className="px-2 sm:px-4 py-3 text-zinc-900 align-top">
                <div className="flex flex-wrap gap-1">
                  {normalizaMultiValor(p.categorias).map((cat, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-1 bg-purple-100 rounded text-xs  border border-purple-200"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-2 sm:px-4 py-3 flex flex-col sm:flex-row gap-2 whitespace-nowrap">
                <BotonClaro
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold"
                  onClick={() => onEditar(p)}
                >
                  Editar
                </BotonClaro>
                <Boton
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold"
                  onClick={() => onEliminar(p.id)}
                >
                  Eliminar
                </Boton>
              </td>
            </tr>
          ))}
          {productos.length === 0 && (
            <tr>
              <td colSpan={7} className="py-6 text-center text-zinc-400">
                No hay productos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
