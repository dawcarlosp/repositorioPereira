import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { apiRequest } from "@services/api";
import Boton from "@components/common/Boton";
import UploadAvatar from "@components/vendedor/UploadAvatar";
import { toast } from "react-toastify";
import { useAuth } from "@context/useAuth";
import { validateUser } from "@/services/validateUser";
import InputFieldsetValidaciones from "@components/common/InputFieldsetValidaciones";

function FormEditarPerfil({ isOpen, setIsOpen, usuario }) {
  const dialogRef = useRef(null);
  const [foto, setFoto] = useState(null);
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
   const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isOpen) {
      setNombre(usuario?.nombre || "");
      setEmail(usuario?.email || "");
      setPassword("");
      setFoto(null);
      setErrors({});
        setTouched({});
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen, usuario]);

  useEffect(() => {
    setErrors(validateUser({ nombre, email, password, foto }, { validarFoto: false }));
  }, [nombre, email, password, foto]);

  const handleEditar = async (e) => {
    e.preventDefault();
      console.log("Archivo foto:", foto.name, foto.type, foto.size);
    const validationErrors = validateUser({ nombre, email, password, foto }, { validarFoto: false });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Revisa los campos marcados.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    const userDTO = { nombre, email };
    if (password.trim()) userDTO.password = password;
    formData.append("user", new Blob([JSON.stringify(userDTO)], { type: "application/json" }));
    if (foto) formData.append("foto", foto);

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
      toast.error(err.message || "Error al editar");
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
      className={`flex flex-col items-center rounded-xl mx-auto shadow-2xl
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
        <UploadAvatar
          setFile={setFoto}
          file={foto}
          
          fotoActualUrl={
            usuario?.foto
              ? `${import.meta.env.VITE_API_URL}/imagenes/vendedores/${usuario.foto}`
              : null
          }
        />
         {errors.foto && (
          <div className="bg-white text-red-700 text-sm font-medium py-1 px-3 rounded shadow mb-3 text-center">
            {errors.foto}
          </div>
        )}

        <InputFieldsetValidaciones
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
          error={errors.nombre}
          touched={touched.nombre}
          onBlur={() => setTouched((t) => ({...t, nombre: true}))}
        />


        <InputFieldsetValidaciones
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          error={errors.email}
          touched={touched.email}
          onBlur={() => setTouched((t) => ({...t, email: true}))}
        />

        <InputFieldsetValidaciones
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nueva contraseña (opcional)"
          autoComplete="new-password"
          error={errors.password}
          touched={touched.password}
          onBlur={() => setTouched((t) => ({...t, password: true}))}
        />

        <Boton>{loading ? "Actualizando..." : "Actualizar"}</Boton>
      </form>
    </dialog>
  );
}

export default FormEditarPerfil;
