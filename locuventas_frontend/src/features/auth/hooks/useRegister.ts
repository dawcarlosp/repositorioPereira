// src/features/auth/hooks/useRegister.ts
import { useState, useEffect } from "react";
import { apiRequest } from "@services/api";
import { validateUser } from "@utils/user.validator";
import { toast } from "react-toastify";

interface UseRegisterReturn {
  foto:           File | null;
  setFoto:        (v: File | null) => void;
  nombre:         string;
  setNombre:      (v: string) => void;
  email:          string;
  setEmail:       (v: string) => void;
  password:       string;
  setPassword:    (v: string) => void;
  loading:        boolean;
  errors:         Record<string, string>;
  touched:        Record<string, boolean>;
  showReminder:   boolean;
  handleBlur:     (field: string) => void;
  handleRegister: () => Promise<void>;
}

export default function useRegister(
  isOpen: boolean,
  onSuccess: () => void
): UseRegisterReturn {
  const [foto,         setFoto]         = useState<File | null>(null);
  const [nombre,       setNombre]       = useState("");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [loading,      setLoading]      = useState(false);
  const [errors,       setErrors]       = useState<Record<string, string>>({});
  const [touched,      setTouched]      = useState<Record<string, boolean>>({});
  const [showReminder, setShowReminder] = useState(false);

  // Resetear al abrir
  useEffect(() => {
    if (!isOpen) return;

    setFoto(null);
    setNombre("");
    setEmail("");
    setPassword("");
    setErrors({});
    setTouched({});
    setShowReminder(true);

    const timer = setTimeout(() => setShowReminder(false), 6000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Validación reactiva
  useEffect(() => {
    setErrors(
      validateUser({ nombre, email, password, foto }, { validarFoto: true })
    );
  }, [nombre, email, password, foto]);

  const handleBlur = (field: string): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleRegister = async (): Promise<void> => {
    const validationErrors = validateUser(
      { nombre, email, password, foto },
      { validarFoto: true }
    );
    setErrors(validationErrors);
    setTouched({ nombre: true, email: true, password: true, foto: true });

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Revisa los campos marcados.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        "user",
        new Blob([JSON.stringify({ nombre, email, password })], {
          type: "application/json",
        })
      );
      // foto está garantizado no-null por la validación anterior
      formData.append("foto", foto as Blob);

      await apiRequest("auth/register", formData, {
        isFormData: true,
        method: "POST",
      });

      toast.success("¡Registro exitoso!");
      onSuccess();
    } catch (err) {
      const errorObj = err as Record<string, string>;
      setErrors(errorObj);
      Object.values(errorObj).forEach((msg) => toast.error(msg));
    } finally {
      setLoading(false);
    }
  };

  return {
    foto,        setFoto,
    nombre,      setNombre,
    email,       setEmail,
    password,    setPassword,
    loading,
    errors,
    touched,
    showReminder,
    handleBlur,
    handleRegister,
  };
}