import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import Boton from "@components/common/Boton";
import BotonClaro from "@components/common/BotonClaro";
function VentasNavMenu({ closeMenu }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    if (closeMenu) closeMenu(); 
  };

  const menuItems = [
    {
      label: "Nueva venta",
      path: "/dashboard",
      active: location.pathname === "/dashboard"
    },
    {
      label: "Todas las ventas",
      path: "/ventas",
      active: location.pathname === "/ventas" && !location.pathname.includes("pendientes")
    },
    {
      label: "Pendientes de pago",
      path: "/ventas/pendientes",
      active: location.pathname.includes("/ventas/pendientes")
    },
  ];

  return (
    <>
      {menuItems.map((item) => (
        <div key={item.path} className="w-full md:max-w-xs">
          {item.active ? (
            <Boton disabled={true} className="w-full opacity-80 ring-1 ring-orange-500/50">
              {item.label}
            </Boton>
          ) : (
            <BotonClaro onClick={() => handleNav(item.path)} className="w-full">
              {item.label}
            </BotonClaro>
          )}
        </div>
      ))}
    </>
  )
}

export default VentasNavMenu