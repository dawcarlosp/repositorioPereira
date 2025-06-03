import React from 'react';
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import FormVendedorLogin from "./pages/FormVendedorLogin";
import Dashboard from "./pages/Dashboard";
import FormVendedorRegister from "./components/vendedor/Form/FormVendedorRegister";
import PrivateRoute from "./components/common/PrivateRoute"; // Protección de rutas
//Componente para mostrar mensajes personalizados
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex flex-col items-center ">
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
        </Routes>

        <FormVendedorRegister isOpen={isOpen} setIsOpen={setIsOpen} />
        {/*Configuración de alertas*/}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
