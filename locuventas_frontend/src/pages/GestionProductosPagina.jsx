// src/pages/GestionProductosPagina.jsx
import React, { useState } from "react";
import AppLayout from "@layout/AppLayout";
import Main from "@layout/Main";
import GestionProductos from "@components/productos/GestionProductos";

export default function GestionProductosPagina() {
  return (
    <AppLayout>
      <Main>
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Gestión de Productos
          </h1>
          <p className="text-zinc-400 mt-1">
            Crea, edita y elimina productos del catálogo.
          </p>
        </header>
        <GestionProductos />
      </Main>
    </AppLayout>
  );
}