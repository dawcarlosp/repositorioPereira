import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { apiRequest } from "../../../services/api";
import Boton from "../../common/Boton";
import InputFieldset from "../../common/InputFieldset";
import UploadComponent from "./UploadComponent";
import Error from "../../common/Error";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/useAuth";

function FormEditarPerfil({ isOpen, setIsOpen, usuario }) {
  const dialogRef = useRef(null);
  const [foto, setFoto] = useState(null);
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [password, setPassword] = useState(""); // Nuevo campo contraseña
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [isClosing, setIsClosing] = useState(false);
  const { setAuth } = useAuth();

  useEffect(() => {
    setNombre(usuario?.nombre || "");
    setEmail(usuario?.email || "");
    setPassword(""); // Limpiar contraseña cada vez que se abre
    setFoto(null);
  }, [usuario, isOpen]);

  const handleEditar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrors({});
    const formData = new FormData();
    const userDTO = { nombre, email };
    if (password && password.trim() !== "") {
      userDTO.password = password; // Solo si se quiere cambiar
    }
    formData.append("user", new Blob([JSON.stringify(userDTO)], { type: "application/json" }));
    if (foto) {
      formData.append("foto", foto);
    }
    try {
      const result = await apiRequest("usuarios/editar-perfil", formData, {
        isFormData: true,
        method: "PUT",
      });
      toast.success("Perfil actualizado");
      setAuth((prev) => ({
        ...prev,
        nombre,
        email,
        foto: result.foto || prev.foto,
      }));
      setIsOpen(false);
    } catch (err) {
      setErrors(err);
      setError(err.message || "Error al editar");
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

  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal();
    else dialogRef.current?.close();
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
      <form onSubmit={handleEditar} className="flex flex-col items-center p-10 group min-w-[290px]">
        <UploadComponent
          setFile={setFoto}
          fotoActualUrl={usuario?.foto ? `${import.meta.env.VITE_API_URL}/imagenes/vendedores/${usuario.foto}` : null}
        />
        <Error>{errors.error}</Error>
        <InputFieldset
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
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
          placeholder="Nueva contraseña (opcional)"
          autoComplete="new-password"
        />
        <Error>{errors.password}</Error>
        {error && <Error>{error}</Error>}
        <Boton>{loading ? "Actualizando..." : "Actualizar"}</Boton>
      </form>
    </dialog>
  );
}

export default FormEditarPerfil;
    