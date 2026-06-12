// src/layout/Header/config/userMenuConfig.js
export const userMenuConfig = (h) => [
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