import { useState } from "react";
import { AuthContext } from "./auth.context";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    nombre: null,
    foto: null,
    email: null,
  });

  return (
    <AuthContext.Provider value={{ ...auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
