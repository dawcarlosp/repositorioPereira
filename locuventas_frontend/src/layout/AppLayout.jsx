// src/layout/AppLayout.jsx
import React from "react";
import Header from "./Header/Header";
import Footer from "./Footer";

export default function AppLayout({ children, aside }) {
  return (
    <div className="h-screen flex flex-col bg-zinc-900 overflow-hidden">
      <Header />

      {/* El contenedor del cuerpo que unifica Dashboard y Ventas */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 w-full py-2 px-2 overflow-hidden">
        
        {/* Aquí inyectamos el Main (que viene en children) */}
        {children}

        {/* El Aside es opcional: en Dashboard aparecerá, en Ventas no */}
        {aside && (
          <div className="flex flex-col h-full w-full md:w-96">
            {aside}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}