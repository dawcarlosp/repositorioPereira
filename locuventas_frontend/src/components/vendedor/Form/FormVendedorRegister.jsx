import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { apiRequest } from "../../../services/api";
import Boton from "../../common/Boton";
import InputFieldset from "../../common/InputFieldset";
import UploadComponent from "./UploadComponent";
import Error from "../../common/Error";

function FormVendedorRegister({ isOpen, setIsOpen }) {
  const dialogRef = useRef(null);
  const [foto, setFoto] = useState(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [isClosing, setIsClosing] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrors({});

    const formData = new FormData();
    const userDTO = { nombre, email, password };

    formData.append(
      "user",
      new Blob([JSON.stringify(userDTO)], { type: "application/json" })
    );

    if (foto) {
      formData.append("foto", foto);
    }

    try {
      const result = await apiRequest("auth/register", formData, {
        isFormData: true,
      });

      console.log("Registro exitoso:", result);

      // Limpiar formulario al éxito
      setFoto(null);
      setNombre("");
      setEmail("");
      setPassword("");
      setIsOpen(false);
    } catch (err) {
      setErrors(err); // Actualiza el estado con los errores recibidos
      setError(err.message || "Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true); // Activa la animación de cierre
    setTimeout(() => {
      setIsOpen(false); // Cierra el diálogo después de la animación
      setIsClosing(false); // Restablece el estado
    }, 300); // Duración de la animación (300ms)
  };

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className={`
        flex flex-col items-center rounded-xl mx-auto shadow-2xl
        bg-white/30 backdrop-blur-lg mt-2
        transform transition-all duration-500 ease-out
        ${isClosing ? "opacity-0 translate-y-[-20px]" : ""}
        ${isOpen && !isClosing ? "translate-y-0" : "translate-y-[-100vh]"}
      `}
    >
      <button
        className="border bg-orange-400 text-white hover:bg-purple-500 p-1 rounded-xl cursor-pointer hover:scale-105 self-end me-2 mt-6"
        onClick={handleClose}
      >
        <X size={20} />
      </button>
      <form onSubmit={handleRegister} className="flex flex-col items-center p-10 group">
        <h2 className="text-1xl text-center">
        </h2>

        <UploadComponent setFile={setFoto} />
        <Error>{errors.error}</Error>
        <InputFieldset
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Dinos cómo te llamas"
        />
        <Error>{errors.nombre}</Error>

        <InputFieldset
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
        />
        <Error>{errors.email}</Error>

        <InputFieldset
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        <Error>{errors.password}</Error>

        {error && <Error>{error}</Error>}

        <Boton>{loading ? "Registrando..." : "Registrarse"}</Boton>
      </form>
    </dialog>
  );
}

export default FormVendedorRegister;