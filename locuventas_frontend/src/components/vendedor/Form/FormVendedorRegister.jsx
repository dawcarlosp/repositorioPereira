import React, { useEffect, useRef, useState } from "react";
import { X, UserRound } from "lucide-react";
import { apiRequest } from "../../../services/api";
import Boton from "../../common/Boton";
import InputFieldset from "../../common/InputFieldset";
import UploadComponent from "./UploadComponent";

function FormVendedorRegister({ isOpen, setIsOpen }) {
  const dialogRef = useRef(null);
  const [foto, setFoto] = useState(null); // Nuevo estado para la imagen
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();

    const userDTO = { nombre, email, password };
    const userBlob = new Blob([JSON.stringify(userDTO)], {
      type: "application/json",
    });
    formData.append("user", userBlob);

    // Si hay foto, agregarla al FormData
    if (foto) {
      formData.append("foto", foto);
    }

    try {
      // Hacemos la solicitud con FormData
      const result = await apiRequest("auth/register", formData, {
        isFormData: true,
      });
      console.log("Registro exitoso:", result);
      setIsOpen(false);
    } catch (err) {
      console.error("Error en el registro:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      className="flex flex-col items-center justify-center border rounded-xl self-center mx-auto"
    >
      <button
        className="border bg-purple-500 text-white hover:bg-orange-400 p-1 rounded-xl cursor-pointer hover:scale-105 self-end me-2 mt-6"
        onClick={() => setIsOpen(false)}
      >
        <X size={20} />
      </button>
      <form
        onSubmit={handleRegister}
        className="flex flex-col items-center justify-center p-10"
      >
        <h2 className="text-1xl text-center">
          Regístrate y sacale el máximo provecho a la app
        </h2>
        <UploadComponent setFile={setFoto} />
        <InputFieldset
          label="¿Cómo te llamas?"
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder={"Dinos como te llamas"}
        />
        <InputFieldset
          label="Email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={"Correo electrónico"}
        />
        <InputFieldset
          label="Contraseña"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={"Contraseña"}
        />
        {error && <p className="text-orange-400">{error}</p>}

        <Boton>{loading ? "Registrando..." : "Registrarse"}</Boton>
      </form>
    </dialog>
  );
}

export default FormVendedorRegister;
