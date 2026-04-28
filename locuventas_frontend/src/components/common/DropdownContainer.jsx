// src/components/common/DropdownContainer.jsx
import React from "react";

export default function DropdownContainer({
  children,
  isOpen,
  side = "top",
  arrowOffset = "20px",
  className = "",
  width = "w-64",
}) {
  if (!isOpen) return null;

  const arrowConfigs = {
    top: {
      // Borde superior e izquierdo para formar la punta hacia arriba
      arrowClasses: "-top-[7px] border-t border-l border-purple-500",
      positionStyle: { left: arrowOffset },
    },
    bottom: {
      // Borde inferior y derecho para formar la punta hacia abajo
      arrowClasses: "-bottom-[7px] border-b border-r border-purple-500",
      positionStyle: { left: arrowOffset },
    },
    left: {
      // Borde inferior e izquierdo para punta a la izquierda
      arrowClasses: "-left-[7px] border-l border-b border-purple-500",
      positionStyle: { top: arrowOffset },
    },
    right: {
      // Borde superior y derecho para punta a la derecha
      arrowClasses: "-right-[7px] border-r border-t border-purple-500",
      positionStyle: { top: arrowOffset },
    },
  };

  const { arrowClasses, positionStyle } = arrowConfigs[side];

  return (
    <div className={`absolute z-50 ${width} bg-zinc-900 border border-purple-500 shadow-2xl rounded-xl animate-in fade-in duration-200 ${className}`}>
      {/* FLECHA: Ahora con bordes definidos */}
      <div
        style={positionStyle}
        className={`absolute w-3.5 h-3.5 bg-zinc-900 rotate-45 border-purple-500 ${arrowClasses}`}
      />

      <div className="relative z-10 p-2 h-full">
        {children}
      </div>
    </div>
  );
}