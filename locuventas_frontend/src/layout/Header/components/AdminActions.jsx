// src/layout/Header/components/AdminActions.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import BotonClaro from "@components/common/BotonClaro";
import { toast } from "react-toastify";
import AdminActionsPersonal from "./AdminActionsPersonal";

export default function AdminActions({ h }) {
  const navigate = useNavigate();
  // Detectamos si es móvil para cerrar el menú al hacer click en opciones simples
  const isSmall = ["xs", "sm", "md"].includes(h.breakpoint);

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] text-left ml-2 mb-1">
        Administración
      </p>
      
      {/* Opción Catálogo: Navega directo */}
      <BotonClaro onClick={() => { 
        if(isSmall) h.closeAll(); 
        navigate("/productos/gestion"); 
      }}>
        Catálogo
      </BotonClaro>

      {/* Opción Personal: Maneja su propio acordeón interno */}
      <AdminActionsPersonal h={h} />

      {/* Opción Categorías: Próximamente */}
      <BotonClaro onClick={() => toast.dark("Próximamente...")}>
        Categorías
      </BotonClaro>
    </div>
  );
}