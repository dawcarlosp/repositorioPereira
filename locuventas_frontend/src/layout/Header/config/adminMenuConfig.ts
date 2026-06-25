import { toast } from "react-toastify";
import type { NavigateFunction } from "react-router-dom";
import type { UseHeaderManagerReturn } from "@hooks/useHeaderManager";

interface MenuItem {
  label:       string;
  action?:     () => void;
  children?:   MenuItem[];
  panel?:      string;
  panelWidth?: string;
  panelProps?: Record<string, unknown>;
}

export const adminMenuConfig = (navigate: NavigateFunction, h: UseHeaderManagerReturn): MenuItem[] => [
  {
    label: "Catálogo",
    action: () => navigate("/productos/gestion"),
  },
  {
    label: "Personal",
    children: [
      {
        label: "Solicitudes nuevas",
        action: () => navigate("/vendedores/pendientes"),
        panel: "PendientesList",
        panelWidth: "w-[380px]",
        panelProps: {
          onConfirmacion: h.abrirConfirmacionGlobal,
        },
      },
      {
        label: "Lista de personal",
        action: () => navigate("/vendedores/lista"),
      },
    ],
  },
  {
    label: "Categorías",
    action: () => toast.dark("Próximamente..."),
  },
];
