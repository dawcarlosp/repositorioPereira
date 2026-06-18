import { Route, Routes } from "react-router-dom";
import LoginPage from "@pages/LoginPage";
import Dashboard from "@pages/Dashboard";
import VentasPagina from "@pages/VentasPagina";
import VentasPendientesPagina from "@pages/VentasPendientesPagina";
import VendedoresPendientes from "@pages/VendedoresPendientes";
import GestionProductosPagina from "@pages/GestionProductosPagina";
import SobreMiPage from "@pages/SobreMiPage";
import PrivateRoute from "@components/common/PrivateRoute";

export function AppRoutes({ setIsOpen }) {
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
            <VendedoresPendientes />
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
