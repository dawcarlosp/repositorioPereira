import { Navigate } from "react-router-dom";
import { useAuth } from "@context/useAuth";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { auth } = useAuth();

  if (!auth?.token) {
    return <Navigate to="/" replace />;
  }

  const roles = auth.roles || [];
  const esVendedor = roles.includes("ROLE_VENDEDOR");
  const esAdmin = roles.includes("ROLE_ADMIN");

  if (!esVendedor && !esAdmin) {
    return (
      <div className="flex h-screen items-center justify-center px-4">
        <div className="bg-zinc-900 text-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Cuenta pendiente de aprobación
          </h2>
          <p className="text-gray-300">
            Su cuenta aún no ha sido habilitada como vendedor. Puede navegar
            por la información pública, pero para acceder a la zona de
            vendedores (Dashboard) debe esperar a que un administrador le
            otorgue los permisos correspondientes. Recibirá una notificación
            por correo cuando esté habilitado.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
