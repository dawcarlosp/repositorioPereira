// src/context/auth.context.js
import { createContext } from "react";

export const AuthContext = createContext({
  token: null,
  nombre: null,
  foto: null,
  email: null,
  roles: [],   
  setAuth: () => {},
  logout: () => {},
});
