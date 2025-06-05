// src/components/common/Boton.jsx
import React from "react";

function Boton({ children, disabled, onClick }) {
  const baseStyle = `
    w-full max-w-xs px-4 py-2 font-semibold rounded-xl transition-all duration-300 
    text-white bg-zinc-900 tracking-wide cursor-pointer
  `;

  const enabledStyle = `
    cursor-pointer
    ring-2 ring-orange-400 shadow-[0_0_12px_2px_rgba(251,146,60,0.4)]
    hover:ring-purple-500 hover:shadow-[0_0_18px_4px_rgba(168,85,247,0.6)] 
    hover:scale-105
  `;

  const disabledStyle = `
    opacity-60 cursor-not-allowed ring-2 ring-orange-300 shadow-none 
  `;

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${disabled ? disabledStyle : enabledStyle}`}
    >
      {children}
    </button>
  );
}

export default Boton;
