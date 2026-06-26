// src/features/auth/hooks/useLogin.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@services/api";
import { useAuth } from "@context/useAuth";
import type { Auth, Role } from "@features/auth/domain/auth.types";

interface LoginResponse {
  data: {
    token:  string;
    roles:  string[];
    nombre: string;
    foto:   string;
    email:  string;
  };
  message?: string;
}

interface BackendError {
  message?:   string;
  path?:      string;
  timestamp?: string;
}

interface UseLoginReturn {
  email:          string;
  setEmail:       (v: string) => void;
  password:       string;
  setPassword:    (v: string) => void;
  loading:        boolean;
  error:          string | null;
  mostrarAlerta:  boolean;
  mensajeAlerta:  string;
  cerrarAlerta:   () => void;
  handleLogin:    (e: React.SubmitEvent) => Promise<void>;
}

export default function useLogin(): UseLoginReturn {
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");

  const { setAuth } = useAuth();
  const navigate    = useNavigate();

  const handleLogin = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await apiRequest<LoginResponse>(
        "auth/login",
        { email, password }
      );

      if (result.data.token) {
        setAuth({
          token:  result.data.token,
          nombre: result.data.nombre,
          foto:   result.data.foto,
          email:  result.data.email,
          // Cast seguro — el backend garantiza estos valores
          roles:  result.data.roles as Role[],
        });
        navigate("/dashboard");
      } else if (result.message) {
        setMensajeAlerta(result.message);
        setMostrarAlerta(true);
      } else {
        setError("No se recibió un token");
      }
    } catch (err) {
      const errorObj = err as BackendError;
      // Error con path y timestamp → respuesta estructurada del backend (ej: 401)
      if (errorObj.message && errorObj.path && errorObj.timestamp) {
        setMensajeAlerta(errorObj.message);
        setMostrarAlerta(true);
      } else if (errorObj.message) {
        setError(errorObj.message);
      } else {
        setError("Error en la autenticación");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,        setEmail,
    password,     setPassword,
    loading,
    error,
    mostrarAlerta,
    mensajeAlerta,
    cerrarAlerta: () => setMostrarAlerta(false),
    handleLogin,
  };
}