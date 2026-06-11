// src/layout/Header/config/adminMenuConfig.js
import { toast } from "react-toastify";

export const adminMenuConfig = (navigate, h) => [
  {
    label: "Catálogo",
    action: () => navigate("/productos/gestion"),
  },
  {
    label: "Personal",
    children: [
      {
        label: "Solicitudes nuevas",
        panel: "PendientesList",
        panelWidth: "w-[380px]"
      },
      {
        label: "Lista de personal",
        action: () => navigate("/vendedores/pendientes"),
      },
    ],
  },
  {
    label: "Categorías",
    action: () => toast.dark("Próximamente..."),
  },
];