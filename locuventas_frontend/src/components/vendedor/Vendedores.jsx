// src/components/Vendedores.jsx
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

export default function Vendedores() {
  const [vendedores, setVendedores] = useState([]);

  useEffect(() => {
    async function fetchVendedores() {
      try {
        const data = await apiRequest("usuarios/vendedores", {}, { method: "GET" });
        setVendedores(data);
      } catch (err) {
        console.error("Error cargando vendedores:", err);
      }
    }
    fetchVendedores();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Lista de Vendedores</h1>
      <table className="w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-zinc-900 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Avatar</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vendedores.map((v) => (
            <tr key={v.id} className="border-b last:border-none">
              <td className="px-4 py-2">
                <img
                  src={v.foto ? `${import.meta.env.VITE_API_URL}/imagenes/vendedores/${v.foto}` : "/default-avatar.png"}
                  alt={`Avatar ${v.nombre}`}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-400"
                />
              </td>
              <td className="px-4 py-2">{v.nombre}</td>
              <td className="px-4 py-2">{v.email}</td>
              <td className="px-4 py-2">
                {/* Por ejemplo, botón para desautorizar directamente desde la tabla */}
                <button
                  onClick={async () => {
                    try {
                      await apiRequest(`usuarios/${v.id}/quitar-rol`, {}, { method: "PUT" });
                      setVendedores((prev) => prev.filter((u) => u.id !== v.id));
                    } catch (err) {
                      console.error("Error desautorizando:", err);
                    }
                  }}
                  className="
                    bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-lg
                    hover:bg-red-700 transition-colors
                  "
                >
                  Desautorizar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
