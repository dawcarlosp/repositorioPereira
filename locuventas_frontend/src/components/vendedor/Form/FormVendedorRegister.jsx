// src/components/vendedor/FormVendedorRegister.jsx
import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { apiRequest } from "../../../services/api";
import Boton from "../../common/Boton";
import InputFieldset from "../../common/InputFieldset";
import UploadComponent from "./UploadComponent";
import Error from "../../common/Error";
import { toast } from "react-toastify";

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

  useEffect(() => {
    if (isOpen) {
      setFoto(null);
      setNombre("");
      setEmail("");
      setPassword("");
      setError(null);
      setErrors({});
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!foto) {
      setError("Debes seleccionar una foto.");
      return;
    }
    setLoading(true);
    setError(null);
    setErrors({});
    const formData = new FormData();
    const userDTO = { nombre, email, password };
    formData.append(
      "user",
      new Blob([JSON.stringify(userDTO)], { type: "application/json" })
    );
    formData.append("foto", foto);

    try {
      await apiRequest("auth/register", formData, {
        isFormData: true,
        method: "POST",
      });
      toast.success("¡Registro exitoso!");
      setIsOpen(false);
    } catch (err) {
      setErrors(err);
      setError(err.error || "Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

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
        type="button"
        className="border bg-orange-400 text-white hover:bg-purple-500 p-1 rounded-xl cursor-pointer hover:scale-105 self-end me-2 mt-6"
        onClick={handleClose}
      >
        <X size={20} />
      </button>
      <form
        onSubmit={handleRegister}
        className="flex flex-col items-center p-10 group"
        encType="multipart/form-data"
      >
        <UploadComponent setFile={setFoto} file={foto} />
        {!foto && <Error>Debes seleccionar una foto.</Error>}
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
        <Boton type="submit" disabled={!foto || loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </Boton>
      </form>
    </dialog>
  );
}

export default FormVendedorRegister;
