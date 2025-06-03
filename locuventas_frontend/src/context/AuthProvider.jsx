import React from 'react';
import { useState, useEffect } from "react";
import { AuthContext } from "./auth.context";

export const AuthProvider = ({ children }) => {
  const [auth, setAuthState] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : {
      token: null,
      nombre: null,
      foto: null,
      email: null,
    };
  });

  // Actualizar localStorage cada vez que cambie auth
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  const setAuth = (data) => {
    setAuthState(data);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuthState({
      token: null,
      nombre: null,
      foto: null,
      email: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
