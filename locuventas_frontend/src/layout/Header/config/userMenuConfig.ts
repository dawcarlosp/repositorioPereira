import type { UseHeaderManagerReturn } from "@hooks/useHeaderManager";
import type { MenuItem } from "@domain/ui.types";

export const userMenuConfig = (h: UseHeaderManagerReturn): MenuItem[] => [
  {
    label: "Editar Perfil",
    action: () => {
      h.setModalEditar(true);
      h.closeAll();
    },
  },
  {
    label: "Developer Info",
    route: "/aboutme",
  },
  {
    label: "Cerrar Sesión",
    action: (e) => {
      e?.stopPropagation();
      h.setMostrarConfirmacionLogout(true);
      h.closeAll();
    },
    danger: true,
  },
];
