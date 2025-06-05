// src/components/common/BotonClaro.jsx
import React from "react";

/**
 * BotonClaro es “exactamente” tu componente, pero envuelto en forwardRef 
 * para poder pasarle un ref desde el dropdown padre.
 */
const BotonClaro = React.forwardRef(({ children, disabled, onClick }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-2 px-4 rounded-xl font-semibold tracking-wide transition-all duration-300
        ${disabled
          ? "bg-zinc-700 text-gray-300 cursor-not-allowed opacity-60"
          : "bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-105 cursor-pointer"}
      `}
    >
      {children}
    </button>
  );
});

export default BotonClaro;
