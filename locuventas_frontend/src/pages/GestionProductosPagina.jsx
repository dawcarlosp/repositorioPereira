import React, { useEffect, useState, useRef } from "react";
import Header from "@layout/Header/Header";
import AppLayout from "@layout/AppLayout";
import Main from "@layout/Main";
import GestionProductos from "@components/productos/GestionProductos";

function GestionProductosPagina() {
  return (
    <AppLayout>
      <Main>
        <GestionProductos />
      </Main>
    </AppLayout>
  );
}

export default GestionProductosPagina;
