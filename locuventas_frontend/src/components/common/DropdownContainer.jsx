// src/components/common/DropdownContainer.jsx
import React, { useLayoutEffect, useState, useRef } from "react";

export default function DropdownContainer({
  children,
  isOpen,
  side = "top",
  triggerRef, // <--- Nueva Prop: Referencia del botón que lo abre
  arrowOffset: manualOffset = "20px",
  className = "",
  width = "w-64",
}) {
  const [dynamicOffset, setDynamicOffset] = useState(manualOffset);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (isOpen && triggerRef?.current && containerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      if (side === "left" || side === "right") {
        // Calcular el centro vertical:
        // (Posición botón + Mitad altura botón) - Posición inicial del contenedor
        const offset = (triggerRect.top + triggerRect.height / 2) - containerRect.top;
        setDynamicOffset(`${offset}px`);
      } else {
        // Calcular el centro horizontal:
        const offset = (triggerRect.left + triggerRect.width / 2) - containerRect.left;
        setDynamicOffset(`${offset}px`);
      }
    }
  }, [isOpen, side, triggerRef]);

  if (!isOpen) return null;

  const arrowConfigs = {
    top: {
      arrowClasses: "-top-[7px] border-t border-l border-purple-500",
      positionStyle: { left: dynamicOffset },
    },
    bottom: {
      arrowClasses: "-bottom-[7px] border-b border-r border-purple-500",
      positionStyle: { left: dynamicOffset },
    },
    left: {
      arrowClasses: "-left-[7px] border-l border-b border-purple-500",
      positionStyle: { top: dynamicOffset },
    },
    right: {
      arrowClasses: "-right-[7px] border-r border-t border-purple-500",
      positionStyle: { top: dynamicOffset },
    },
  };

  const { arrowClasses, positionStyle } = arrowConfigs[side];

  return (
    <div 
      ref={containerRef}
      className={`absolute z-50 ${width} bg-zinc-900 border border-purple-500 shadow-2xl rounded-xl animate-in fade-in duration-200 ${className}`}
    >
      <div
        style={positionStyle}
        className={`absolute w-3.5 h-3.5 bg-zinc-900 rotate-45 border-purple-500 transition-all duration-300 ${arrowClasses}`}
      />
      <div className="relative z-10 p-2 h-full">{children}</div>
    </div>
  );
}