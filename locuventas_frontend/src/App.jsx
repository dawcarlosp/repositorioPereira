// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import VendedoresPendientes from "./pages/VendedoresPendientes";

import FormVendedorLogin from "./pages/FormVendedorLogin";
import Dashboard from "./pages/Dashboard";
import FormVendedorRegister from "./components/vendedor/Form/FormVendedorRegister";
import PrivateRoute from "./components/common/PrivateRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col items-center">
          <Routes>
            <Route
              path="/"
              element={<FormVendedorLogin setIsOpen={setIsOpen} />}
            />

            {/* Ruta protegida con PrivateRoute */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendedores"
              element={
                <PrivateRoute>
                  <Dashboard />
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
          </Routes>

          <FormVendedorRegister isOpen={isOpen} setIsOpen={setIsOpen} />

          {/* Configuración de Toasts */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
            toastClassName="bg-white/30 backdrop-blur-lg text-gray-900 rounded-xl p-4 shadow-lg border border-white/40"
            bodyClassName="text-sm font-medium"
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
