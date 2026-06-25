import type { UseHeaderManagerReturn } from "@hooks/useHeaderManager";

interface UserMenuItem {
  label:   string;
  action?: (e?: React.MouseEvent) => void;
  route?:  string;
  danger?: boolean;
}

export const userMenuConfig = (h: UseHeaderManagerReturn): UserMenuItem[] => [
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
