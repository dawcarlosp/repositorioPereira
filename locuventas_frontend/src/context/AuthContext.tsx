// src/context/AuthContext.tsx
import { createContext, useState, useEffect, useCallback } from "react";
import type { Auth } from "@domain/auth.types";

interface AuthContextValue {
  auth:    Auth;
  setAuth: (data: Partial<Auth>) => void;
  logout:  () => void;
}

const AUTH_INITIAL: Auth = {
  token:  null,
  nombre: null,
  foto:   null,
  email:  null,
  roles:  [],
};

const loadStoredAuth = (): Auth => {
  try {
    const stored = localStorage.getItem("auth");
    return stored ? (JSON.parse(stored) as Auth) : AUTH_INITIAL;
  } catch {
    return AUTH_INITIAL;
  }
};

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] ?? ""))  as { exp: number };
    return Date.now() > payload.exp * 1000;
  } catch {
    return true; // token corrupto → tratar como expirado
  }
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuthState] = useState<Auth>(loadStoredAuth);

  const logout = useCallback((): void => {
    localStorage.removeItem("auth");
    setAuthState(AUTH_INITIAL);
  }, []);

  // Sincronizar con localStorage
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  // Validar token al montar
  useEffect(() => {
    if (!auth.token) return;
    if (isTokenExpired(auth.token)) {
      console.warn("Token expirado — cerrando sesión");
      logout();
      window.location.href = "/login";
    }
  }, [auth.token, logout]);

  const setAuth = (data: Partial<Auth>): void => {
    setAuthState((prev) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}