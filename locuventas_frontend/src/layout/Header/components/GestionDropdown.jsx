// src/components/layout/GestionDropdown.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import BotonClaro from "@components/common/BotonClaro";
import DropdownContainer from "@components/common/DropdownContainer"; // Importamos el nuevo componente
import { toast } from "react-toastify";
import AdminActions from "@layout/Header/components/AdminActions";

export default function GestionDropdown({ isOpen, onClickVendedores, children }) {
  const navigate = useNavigate();

  return (
    <DropdownContainer
    isOpen={isOpen}
      // La flecha sale por la parte superior
      side="top" 
      /* AJUSTE DE PRECISIÓN:
         Como el dropdown está alineado a la derecha (right-1), 
         el 100% es el borde izquierdo. 
         Para apuntar al botón "Gestión", la flecha debe estar 
         hacia la derecha. Prueba con un valor entre el 70% y 85%.
      */
      arrowOffset="82%" 
      width="w-48"
      className="absolute top-full mt-3 right-1"
    >
      <div className="space-y-1">
       <AdminActions onClickVendedores={onClickVendedores}/>
      </div>

      {children}
    </DropdownContainer>
  );
}