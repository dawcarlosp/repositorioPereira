// src/layout/Header/config/userMenuConfig.js
import { toast } from "react-toastify";

export const userMenuConfig = (h) => [
  {
    label: "Editar Perfil",
    action: () => {
      h.setModalEditar(true);
    },
  },
  {
    label: "Developer Info",
    action: () => {
      toast.info("Desarrollado con ❤️ en React & Tailwind.");
    },
  },
  {
    label: "Cerrar Sesión",
    action: () => {
      h.setMostrarConfirmacionLogout(true);
    },
  },
];