import React, { useState } from 'react';
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  const isValid = touched && !error && value;
  const isInvalid = touched && !!error;

  return (
    <label className="block w-80 mb-2">
      {/* Caja del input, SIEMPRE con fondo morado y borde visual */}
      <div className={`
        relative rounded-xl shadow-md
        transition-all
        ${isValid
          ? "border-2 border-purple-500"
          : isInvalid
          ? "border-2 border-orange-700"
          : "border border-gray-300"
        }
        bg-purple-100
      `}>
        <input
          type={type === "password" && showPassword ? "text" : type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder=" "
          required={required}
          onBlur={onBlur}
          className="peer w-full py-4 px-4 text-gray-700 text-base bg-purple-100 rounded-xl focus:outline-none placeholder-transparent"
        />
        <span
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 text-base
            transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
            peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm 
            peer-focus:text-purple-500 peer-not-placeholder-shown:top-2 
            peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-purple-500"
          style={{ pointerEvents: "none" }}
        >
          {placeholder}
        </span>
        {/* Iconos */}
        {isValid && (
          <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
        )}
        {isInvalid && (
          <AlertCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-700 w-5 h-5" />
        )}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-500"
            tabIndex={-1}
          >
            {showPassword
              ? <EyeOff className="w-5 h-5 cursor-pointer" />
              : <Eye className="w-5 h-5 cursor-pointer" />}
          </button>
        )}
      </div>
      {/* Error: debajo, nunca muestra borde ni fondo salvo si hay error */}
      <div
        className={`
          text-xs mt-2 px-3 py-1 rounded-lg font-medium transition-all min-h-[24px]
          ${isInvalid ? "text-orange-700 bg-white/90 shadow" : "bg-transparent"}
        `}
        style={{
          minHeight: 24
        }}
      >
        {isInvalid ? error : ""}
      </div>
    </label>
  );
}

export default InputFieldsetValidaciones;
