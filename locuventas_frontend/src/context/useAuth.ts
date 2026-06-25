// src/context/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import type { Auth } from "@domain/auth.types";

interface UseAuthReturn {
  auth:    Auth;
  setAuth: (data: Partial<Auth>) => void;
  logout:  () => void;
}

export const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};