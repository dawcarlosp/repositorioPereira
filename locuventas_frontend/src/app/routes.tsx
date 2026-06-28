import { Route, Routes } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import Dashboard from "@features/ventas/pages/Dashboard";
import VentasPagina from "@features/ventas/pages/VentasPagina";
import VentasPendientesPagina from "@features/ventas/pages/VentasPendientesPagina";
import VendedoresPendientesPagina from "@/features/auth/pages/VendedoresPendientesPagina";
import GestionProductosPagina from "@features/productos/pages/GestionProductosPagina";
import SobreMiPage from "@pages/SobreMiPage";
import PrivateRoute from "@components/common/PrivateRoute";

interface AppRoutesProps {
  setIsOpen: (v: boolean) => void;
}

export function AppRoutes({ setIsOpen }: AppRoutesProps) {
  return (
    <Routes>
      <Route path="/" element={<LoginPage setIsOpen={setIsOpen} />} />
      <Route path="/login" element={<LoginPage setIsOpen={setIsOpen} />} />
      <Route path="/aboutme" element={<SobreMiPage />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/ventas"
        element={
          <PrivateRoute>
            <VentasPagina />
          </PrivateRoute>
        }
      />
      <Route
        path="/ventas/pendientes"
        element={
          <PrivateRoute>
            <VentasPendientesPagina />
          </PrivateRoute>
        }
      />
      <Route
        path="/vendedores/pendientes"
        element={
          <PrivateRoute>
            <VendedoresPendientesPagina />
          </PrivateRoute>
        }
      />
      <Route
        path="/productos/gestion"
        element={
          <PrivateRoute>
            <GestionProductosPagina />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
