import { useState, useEffect } from "react";
import { AuthContext } from "./auth.context";

export const AuthProvider = ({ children }) => {
  // Carga desde localStorage al arrancar
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

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  // El setAuth NO debe borrar el token a menos que sea logout
  const setAuth = (dataOrFn) => {
    setAuthState((prev) =>
      typeof dataOrFn === "function" ? dataOrFn(prev) : { ...prev, ...dataOrFn }
    );
  };

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
