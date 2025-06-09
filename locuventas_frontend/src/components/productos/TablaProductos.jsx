import Boton from "../common/Boton";
import BotonClaro from "../common/BotonClaro";

// Si usas Vite, importa la variable de entorno así:
const API_URL = import.meta.env.VITE_API_URL;

export default function TablaProductos({ productos, onEditar, onEliminar }) {
  return (
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
                hover:bg-orange-100 transition
              `}
            >
              <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-gray-900">
                {p.id}
              </td>
              <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                {p.foto ? (
                  <img
                    src={`${API_URL}/imagenes/productos/${p.foto}`}
                    alt={p.nombre}
                    className="w-14 h-10 object-cover rounded shadow border border-gray-200"
                  />
                ) : (
                  <span className="text-gray-300">Sin foto</span>
                )}
              </td>
              <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-gray-900">
                {p.nombre}
              </td>
              <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-gray-900">
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
              <td colSpan={7} className="py-6 text-center text-gray-400">
                No hay productos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
