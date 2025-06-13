import React, { useEffect, useRef, useState } from "react";
import { apiRequest } from "@services/api";
import Boton from "@components/common/Boton";
import InputFieldsetValidaciones from "@components/common/InputFieldsetValidaciones";
import UploadAvatar from "@components/vendedor/UploadAvatar";
import { toast } from "react-toastify";
import BotonCerrar from "@components/common/BotonCerrar";
import { validateUser } from "@/services/validateUser";

function FormVendedorRegister({ isOpen, setIsOpen }) {
  const dialogRef = useRef(null);
  const [foto, setFoto] = useState(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFoto(null);
      setNombre("");
      setEmail("");
      setPassword("");
      setErrors({});
      setTouched({});
      toast.dark("Recuerda que en Locuventas es obligatorio proporcionar una foto al registrarse!");
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    setErrors(validateUser({ nombre, email, password, foto }, { validarFoto: true }));
  }, [nombre, email, password, foto]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validateUser({ nombre, email, password, foto }, { validarFoto: true });
    setErrors(validationErrors);
    setTouched({ nombre: true, email: true, password: true, foto: true });

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Revisa los campos marcados.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    const userDTO = { nombre, email, password };
    formData.append("user", new Blob([JSON.stringify(userDTO)], { type: "application/json" }));
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
      Object.values(err).forEach((msg) => toast.error(msg));
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
      <BotonCerrar onClick={handleClose} />
      <form
        onSubmit={handleRegister}
        className="flex flex-col items-center p-10 group min-w-[290px]"
        encType="multipart/form-data"
        autoComplete="off"
      >
        <UploadAvatar
          setFile={(file) => {
            setFoto(file);
            setTouched((t) => ({ ...t, foto: true }));
          }}
          file={foto}
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
          placeholder="Dinos cómo te llamas"
          error={errors.nombre}
          touched={touched.nombre}
          onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
        />

        <InputFieldsetValidaciones
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          error={errors.email}
          touched={touched.email}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        />

        <InputFieldsetValidaciones
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          error={errors.password}
          touched={touched.password}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        />

        <Boton type="submit" disabled={loading || Object.keys(errors).length > 0}>
          {loading ? "Registrando..." : "Registrarse"}
        </Boton>
      </form>
    </dialog>
  );
}

export default FormVendedorRegister;
