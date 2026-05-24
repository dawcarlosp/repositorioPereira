import React from 'react';
import { Check, AlertCircle } from "lucide-react";
import InputFieldset from "@components/common/InputFieldset"; // Importamos el componente base

function InputFieldsetValidaciones({
  type = "text",
  id,
  value,
  onChange,
  placeholder,
  required = false,
  error = null,
  touched = false,
  onBlur,
}) {
  const isValid = touched && !error && value;
  const isInvalid = touched && !!error;

  // Calculamos dinámicamente qué bordes aplicarle al componente base según su estado
  const validationStyles = `
    bg-purple-100 
    ${isValid 
      ? "border-2 border-purple-500" 
      : isInvalid 
      ? "border-2 border-orange-700" 
      : "border border-gray-300"
    }
  `;

  return (
    <div className="block w-full max-w-xs mb-2 mx-auto relative">
      
      {/* Reutilizamos el input base pasándole toda la configuración y sus clases de estado */}
      <InputFieldset
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        onBlur={onBlur}
        customClasses={validationStyles}
      />

      {/* Capa de Iconos decorativos de validación colocados de forma absoluta */}
      {isValid && (
        <Check className="absolute right-4 top-[26px] transform -translate-y-1/2 text-purple-500 w-5 h-5 pointer-events-none" />
      )}
      {isInvalid && (
        <AlertCircle className="absolute right-4 top-[26px] transform -translate-y-1/2 text-orange-700 w-5 h-5 pointer-events-none" />
      )}

      {/* Espacio del mensaje de error inferior */}
      <div
        className={`text-xs mt-1 px-3 py-1 rounded-lg font-medium transition-all min-h-[24px]
          ${isInvalid ? "text-orange-700 bg-white/90 shadow" : "bg-transparent"}`}
        style={{ minHeight: 24 }}
      >
        {isInvalid ? error : ""}
      </div>
    </div>
  );
}

export default InputFieldsetValidaciones;