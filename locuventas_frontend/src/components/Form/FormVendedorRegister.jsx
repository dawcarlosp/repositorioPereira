import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { UserRound } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "../../services/api";
function FormVendedorRegister({ isOpen, setIsOpen }) {
  const dialogRef = useRef(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await apiRequest("auth/register", { nombre, email, password });
      console.log("Registro exitoso:", result);
      setIsOpen(false); // Cierra el modal tras registro exitoso
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Maneja la visibilidad del modal con useEffect
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal(); // Muestra el modal
    } else {
      dialogRef.current?.close(); // Cierra el modal
    }
  }, [isOpen]);
  if (!isOpen) return null; // Evita que el componente se renderice si isOpen es false
  return (
    <dialog
      ref={dialogRef}
      className="flex flex-col items-center justify-center border p-5 rounded-xl self-center mx-auto"
    >
      <button
        className="border bg-purple-500 text-white hover:bg-orange-400 p-1 rounded-xl cursor-pointer hover:scale-105 self-end"
        onClick={() => setIsOpen(false)}
      >
        <X size={20} />
      </button>
      <form onSubmit={handleRegister}
       className="flex flex-col items-center justify-center">
        <h2 className="text-2xl text-center">
          Regístrate y sacale el máximo provecho a la app
        </h2>
        <UserRound
          size={100}
          className="border-2 border-purple-500 rounded-full text-purple-500 hover:border-orange-400 hover:text-orange-400 hover:border-3 cursor-pointer hover:scale-105"
        />
        <fieldset className="flex flex-col  items-center justify-center">
          <label htmlFor="nombre">¿Cómo te llamas?</label>
          <input
            type="text"
            id="nombre"
            className="border rounded-xl w-80 py-2"
            value={nombre} onChange={(e) => setNombre(e.target.value)} required
          />
        </fieldset>
        <fieldset className="flex flex-col  items-center justify-center">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="border rounded-xl  w-80 py-2"
            value={email} onChange={(e) => setEmail(e.target.value)} required
          />
        </fieldset>
        <fieldset className="flex flex-col  items-center justify-center">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            className="border rounded-xl  w-80 py-2"
            value={password} onChange={(e) => setPassword(e.target.value)} required
          />
        </fieldset>
        {error && <p className="text-orange-400">{error}</p>}
        <button
          className="border my-4 p-2 rounded-xl bg-purple-500 text-white hover:bg-orange-400 cursor-pointer hover:scale-105"
          id="registrarse"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </dialog>
  );
}

export default FormVendedorRegister;
