// src/components/common/MenuButton.jsx
import React from "react";
import BotonClaro from "@buttons/BotonClaro";
import { 
  CircleArrowLeft, 
  CircleArrowRight, 
  CircleArrowDown, 
  CircleArrowUp 
} from "lucide-react";

export default function MenuButton({ 
  label, 
  onClick, 
  isActive, 
  hasChildren, 
  variant = "purple", // "purple" o "orange"
  isMobile = false,
  className = "",
  ref // En React 19, extraemos ref directamente de las props
}) {
  
  // Definimos los estilos de "Activo" según la variante
  const activeStyles = {
    orange: "text-orange-400 bg-orange-500/10 ring-1 ring-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]",
    purple: "text-purple-400 bg-purple-500/10 ring-1 ring-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
  };

  const currentActiveClass = isActive ? activeStyles[variant] : "";

  // Lógica de Iconos de dirección
  const renderIcon = () => {
    if (!hasChildren) return null;

    if (isMobile) {
      return isActive 
        ? <CircleArrowUp size={16} className="transition-transform duration-300" /> 
        : <CircleArrowDown size={16} className="transition-transform duration-300" />;
    }

    // Cascada Inversa (Derecha a Izquierda)
    return isActive 
      ? <CircleArrowRight className="opacity-50 transition-all" size={16} /> 
      : <CircleArrowLeft className="text-purple-500 transition-all" size={16} />;
  };

  return (
    <BotonClaro
      ref={ref} // Pasamos la ref hacia abajo al button real
      onClick={onClick}
      className={`
        flex items-center justify-between !text-[10px] uppercase tracking-[0.2em]
        ${currentActiveClass}
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        {renderIcon()}
        <span>{label}</span>
      </div>
    </BotonClaro>
  );
}