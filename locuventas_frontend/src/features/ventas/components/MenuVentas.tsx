import { useNavigate, useLocation } from "react-router-dom";
import Button from "@buttons/Button";

interface Props {
  closeMenu?: () => void;
}

export default function MenuVentas({ closeMenu }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
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
            <Button disabled={true} className="w-full opacity-80 ring-1 ring-orange-500/50">
              {item.label}
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => handleNav(item.path)} className="w-full">
              {item.label}
            </Button>
          )}
        </div>
      ))}
    </>
  )
}
