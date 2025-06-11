import React, { useEffect, useRef, useState } from "react";
import { apiRequest } from "../../../services/api";
import Boton from "../../common/Boton";
import InputFieldsetValidaciones from "../../common/InputFieldsetValidaciones";
import UploadComponent from "../../common/UploadComponent";
import { toast } from "react-toastify";
import BotonCerrar from "../../common/BotonCerrar";

function FormVendedorRegister({ isOpen, setIsOpen }) {
  const dialogRef = useRef(null);
  const [foto, setFoto] = useState(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    nombre: false,
    email: false,
    password: false,
    foto: false,
  });
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFoto(null);
      setNombre("");
      setEmail("");
      setPassword("");
      setErrors({});
      setTouched({ nombre: false, email: false, password: false, foto: false });
      toast.dark(
        "Recuerda que en Locuventas es obligatorio proporcionar una foto al registrarse!"
      );
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  // Adaptado a las reglas del backend, solo ficheros
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ACCEPTED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/avif",
    "image/webp",
    "image/jpg",
  ];

  function validateFoto(file) {
    if (!file) return "Debes seleccionar una foto.";
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "El tipo de archivo no es permitido: " + file.type;
    }
    if (file.size > MAX_FILE_SIZE) {
      return "El archivo es demasiado grande. Solo se permiten archivos de hasta 10 MB.";
    }
    if (!file.name || !/\.[a-zA-Z0-9]+$/.test(file.name)) {
      return "El archivo seleccionado no tiene una extensión válida.";
    }
    return null;
  }

  // Validación igual que el backend
  const validate = () => {
    const errors = {};

    // Nombre: 3-50 letras y espacios
    if (!nombre.trim()) {
      errors.nombre = "El nombre completo es obligatorio";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/.test(nombre)) {
      errors.nombre = "El nombre solo puede contener letras y espacios";
    } else if (nombre.trim().length < 3 || nombre.trim().length > 50) {
      errors.nombre = "El nombre requiere mínimo tres caracteres y máximo 50";
    }

    // Email
    if (!email.trim()) {
      errors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "El email no tiene el formato válido";
    }

    // Password: 8+ chars, 1 min, 1 mayus, 1 num, 1 simbolo
    if (!password) {
      errors.password = "Debe proporcionar una contraseña";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/.test(
        password
      )
    ) {
      errors.password =
        "La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, un número y un carácter especial";
    }

    // Foto
    if (!foto) {
      const fotoError = validateFoto(foto);
      if (fotoError) errors.foto = fotoError;
    }

    return errors;
  };

  // Actualiza errores al escribir
  useEffect(() => {
    setErrors(validate());
    // eslint-disable-next-line
  }, [nombre, email, password, foto]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    // Marca todos los campos como tocados para que se vea el feedback
    setTouched({ nombre: true, email: true, password: true, foto: true });

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Revisa los campos marcados en naranja.");
      return;
    }

    setLoading(true);
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
      if (err.nombre) toast.error(err.nombre);
      if (err.email) toast.error(err.email);
      if (err.password) toast.error(err.password);
      if (err.foto) toast.error(err.foto);
      if (err.error) toast.error(err.error);
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
      <BotonCerrar onClick={handleClose} />
      <form
        onSubmit={handleRegister}
        className="flex flex-col items-center p-10 group"
        encType="multipart/form-data"
        autoComplete="off"
      >
        {/* FOTO */}
        <div
          className={`
          mb-2 w-80 rounded-xl shadow-md border
          ${
            touched.foto && errors.foto
              ? "border-orange-400"
              : "border-gray-300"
          }
        `}
        >
          <UploadComponent
            setFile={(file) => {
              setFoto(file);
              setTouched((t) => ({ ...t, foto: true }));
            }}
            file={foto}
          />
        </div>
        {/* Feedback para la foto, chapucero*/}
        <div
          className={`
    text-xs mt-2 px-3 py-1 rounded-lg font-medium transition-all min-h-[24px]
    ${
      touched.foto && errors.foto
        ? "text-orange-700 bg-white/90 shadow mb-2"
        : "bg-transparent mb-2"
    }
  `}
          style={{ minHeight: 24 }}
        >
          {touched.foto && errors.foto ? errors.foto : ""}
        </div>

        {/* NOMBRE */}
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

        {/* EMAIL */}
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

        {/* PASSWORD */}
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

        <Boton
          type="submit"
          disabled={loading || Object.keys(errors).length > 0}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </Boton>
      </form>
    </dialog>
  );
}

export default FormVendedorRegister;
