import React, { useEffect, useState } from "react";
import { apiRequest } from "@services/api.config";
import DialogFormLayout from "@components/common/DialogFormLayout";
import InputFieldsetValidaciones from "@components/common/InputFieldsetValidaciones";
import UploadAvatar from "@components/vendedor/UploadAvatar";
import { validateUser } from "@/utils/user.validator";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FormVendedorRegister({ isOpen, setIsOpen }) {
  const [foto, setFoto] = useState(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFoto(null);
      setNombre("");
      setEmail("");
      setPassword("");
      setErrors({});
      setTouched({});

      setShowReminder(true);
      const timer = setTimeout(() => setShowReminder(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    setErrors(validateUser({ nombre, email, password, foto }, { validarFoto: true }));
  }, [nombre, email, password, foto]);

  const handleRegister = async () => {
    const validationErrors = validateUser({ nombre, email, password, foto }, { validarFoto: true });
    setErrors(validationErrors);
    setTouched({ nombre: true, email: true, password: true, foto: true });

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Revisa los campos marcados.", { containerId: "modal-toast" });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    const userDTO = { nombre, email, password };
    formData.append("user", new Blob([JSON.stringify(userDTO)], { type: "application/json" }));
    formData.append("foto", foto);

    try {
      await apiRequest("auth/register", formData, { isFormData: true, method: "POST" });
      toast.success("¡Registro exitoso!");
      setIsOpen(false);
    } catch (err) {
      setErrors(err);
      Object.values(err).forEach((msg) => toast.error(msg));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <DialogFormLayout
      visible={isOpen}
      onClose={() => setIsOpen(false)}
      onSubmit={handleRegister}
      titulo="Crear Cuenta de Vendedor"
      botonTexto={loading ? "Registrando..." : "Registrarse"}
      botonDisabled={loading}
    >
      {showReminder && (
        <div className="w-full bg-purple-600/20 border border-purple-500/30 text-purple-200 text-xs py-2 px-3 rounded-lg text-center font-medium animate-pulse mb-2">
          👉 ¡No olvides subir una foto de perfil clara para tu usuario!
        </div>
      )}

      <UploadAvatar setFile={setFoto} file={foto} />
      
      {/* 🛠️ SOLUCIÓN: Agregados los onChange correspondientes a cada campo */}
      <InputFieldsetValidaciones 
        type="text" 
        id="nombre" 
        value={nombre} 
        onChange={(e) => setNombre(e.target.value)} 
        placeholder="Dinos cómo te llamas" 
        error={errors.nombre} 
        touched={touched.nombre} 
      />
      <InputFieldsetValidaciones 
        type="email" 
        id="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Correo electrónico" 
        error={errors.email} 
        touched={touched.email} 
      />
      <InputFieldsetValidaciones 
        type="password" 
        id="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Contraseña" 
        error={errors.password} 
        touched={touched.password} 
      />
      <ToastContainer 
        containerId="modal-toast" 
        position="top-left" 
        autoClose={3000} 
        style={{ zIndex: 999999 }}
      />
    </DialogFormLayout>
  );
}

export default FormVendedorRegister;