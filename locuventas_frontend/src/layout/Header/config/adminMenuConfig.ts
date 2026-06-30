import type { NavigateFunction } from "react-router-dom";
import type { UseHeaderManagerReturn } from "@hooks/useHeaderManager";
import type { MenuItem } from "@domain/ui.types";

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
    action: () => navigate("/categorias/gestion"),
  },
];
