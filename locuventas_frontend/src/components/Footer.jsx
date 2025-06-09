import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Boton from "./common/Boton";
import BotonClaro from "./common/BotonClaro";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  // Comprobamos qué está activo según la ruta
  const isDashboard = location.pathname === "/dashboard";
  const isVentas = location.pathname === "/ventas" && !location.search.includes("pendientes");
  const isPendientes = location.pathname === "/ventas" && location.search.includes("pendientes");

  return (
    <footer
      className="
        w-full sticky bottom-0 left-0 z-30
        bg-black flex flex-col md:flex-row justify-center items-center
        gap-2 md:gap-8
        px-4 py-4
        border-t border-zinc-800
        shadow-xl
      "
    >
      <div className="w-full md:max-w-xs">
        {isDashboard ? (
          <Boton disabled={true} className="w-full">Nueva venta</Boton>
        ) : (
          <BotonClaro onClick={() => navigate("/dashboard")} className="w-full">Nueva venta</BotonClaro>
        )}
      </div>
      <div className="w-full md:max-w-xs">
        {isVentas ? (
          <Boton disabled={true} className="w-full">Todas las ventas</Boton>
        ) : (
          <BotonClaro onClick={() => navigate("/ventas")} className="w-full">Todas las ventas</BotonClaro>
        )}
      </div>
      <div className="w-full md:max-w-xs">
        {isPendientes ? (
          <Boton disabled={true} className="w-full">Pendientes de pago</Boton>
        ) : (
          <BotonClaro onClick={() => navigate("/ventas/pendientes")} className="w-full">Pendientes de pago</BotonClaro>
        )}
      </div>
    </footer>
  );
}
