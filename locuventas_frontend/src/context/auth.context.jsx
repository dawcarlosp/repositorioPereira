import { createContext, useState, useEffect } from "react";

// CONTEXTO
export const AuthContext = createContext({
  token: null,
  nombre: null,
  foto: null,
  email: null,
  roles: [],
  setAuth: () => {},
  logout: () => {},
});

// PROVIDER
export const AuthProvider = ({ children }) => {
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

  // Guarda en localStorage al cambiar
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  // Verifica expiración del token al montar
  useEffect(() => {
    if (auth?.token) {
      try {
        const payload = JSON.parse(atob(auth.token.split('.')[1]));
        const expired = Date.now() > payload.exp * 1000;
        if (expired) {
          logout();
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('Error al decodificar el token:', err);
        logout();
        window.location.href = '/login';
      }
    }
  }, []);

  // Función para actualizar auth
  const setAuth = (dataOrFn) => {
    setAuthState((prev) =>
      typeof dataOrFn === "function" ? dataOrFn(prev) : { ...prev, ...dataOrFn }
    );
  };

  // Función para cerrar sesión
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

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
