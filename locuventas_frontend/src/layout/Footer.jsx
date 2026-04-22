import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Boton from "@components/common/Boton";
import BotonClaro from "@components/common/BotonClaro";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

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
    // Contenedor de la animación
    <div className="w-full mt-auto rounded-t-2xl shadow-2xl">
      
      {/* Contenido real del Footer */}
      <footer className="footer-content flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8 px-4 py-6 rounded-t-2xl border-t border-orange-900/30">
        
        {menuItems.map((item) => (
          <div key={item.path} className="w-full md:max-w-xs">
            {item.active ? (
              <Boton disabled={true} className="w-full opacity-80 ring-1 ring-orange-500/50">
                {item.label}
              </Boton>
            ) : (
              <BotonClaro onClick={() => navigate(item.path)} className="w-full">
                {item.label}
              </BotonClaro>
            )}
          </div>
        ))}

      </footer>
    </div>
  );
}