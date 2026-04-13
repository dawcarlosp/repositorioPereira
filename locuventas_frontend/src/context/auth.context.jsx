import { createContext, useState, useEffect, useCallback } from "react";

// Creamos el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Estado inicial: Carga desde localStorage una sola vez al arrancar
  const [auth, setAuthState] = useState(() => {
    const stored = localStorage.getItem("auth");
    try {
      return stored ? JSON.parse(stored) : { token: null, nombre: null, roles: [] };
    } catch {
      return { token: null, nombre: null, roles: [] };
    }
  });

  // 2. Función Logout: Limpia estado y almacenamiento
  const logout = useCallback(() => {
    localStorage.removeItem("auth");
    setAuthState({ token: null, nombre: null, roles: [] });
  }, []);

  // 3. Sincronización: Cada vez que cambie 'auth', actualizamos localStorage
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  // 4. Guardia de Seguridad: Valida el token (JWT) al montar la App
  useEffect(() => {
    if (auth?.token) {
      try {
        const payload = JSON.parse(atob(auth.token.split('.')[1]));
        const isExpired = Date.now() > payload.exp * 1000;
        
        if (isExpired) {
          logout();
          window.location.href = '/login';
        }
      } catch (e) {
        console.error("Token corrupto detectado");
        logout();
      }
    }
  }, [auth.token, logout]);

  // 5. Función setAuth mejorada (soporta actualización parcial)
  const setAuth = (data) => {
    setAuthState((prev) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};