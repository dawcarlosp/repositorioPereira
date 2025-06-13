import { useState, useEffect } from "react";
import { AuthContext } from "@context/auth.context";

// COMPONENTE PROVIDER
export const AuthProvider = ({ children }) => {
  // 1. Cargar estado desde localStorage
  const [auth, setAuthState] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored
      ? JSON.parse(stored)
      : {
          token: null,
          nombre: null,
          foto: null,
          email: null,
          roles: [],
        };
  });

  // 2. Guardar en localStorage cuando cambia el auth
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  // 3. Validar token expirado al montar el componente
  useEffect(() => {
    const token = auth?.token;

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expired = Date.now() > payload.exp * 1000;

        if (expired) {
          logout();
          window.location.href = '/';
        }
      } catch (err) {
        console.error('Error al decodificar el token:', err);
        logout();
        window.location.href = '/';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 4. Función para actualizar el estado de autenticación
  const setAuth = (dataOrFn) => {
    setAuthState((prev) =>
      typeof dataOrFn === "function" ? dataOrFn(prev) : { ...prev, ...dataOrFn }
    );
  };

  // 5. Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("auth");
    setAuthState({
      token: null,
      nombre: null,
      foto: null,
      email: null,
      roles: [],
    });
  };

  // 6. Proveer contexto
  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
