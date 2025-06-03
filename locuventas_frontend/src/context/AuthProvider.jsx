// src/context/AuthProvider.jsx
import { useState, useEffect } from "react";
import { AuthContext } from "./auth.context";

export const AuthProvider = ({ children }) => {
  // Inicializamos auth leyendo de localStorage, si existe
  const [auth, setAuthState] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored
      ? JSON.parse(stored)
      : {
          token: null,
          nombre: null,
          foto: null,
          email: null,
          roles: [],    // 👈 inicializamos roles como arreglo vacío
        };
  });

  // Cada vez que auth cambie, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  // Función para actualizar auth (recibe un objeto con token, nombre, foto, email, roles)
  const setAuth = (data) => {
    setAuthState(data);
  };

  // Función de logout: borra localStorage y resetea auth
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
