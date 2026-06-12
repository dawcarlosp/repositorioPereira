// src/components/common/BuscadorInput.jsx
import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

export default function BuscadorInput({
  value,
  onChange,
  placeholder = "Buscar...",
  debounceMs = 400,
  className = "",
}) {
  const [localValue, setLocalValue] = useState(value ?? "");
  const timerRef = useRef(null);

  // Sincronizar si el padre resetea el valor externamente
  useEffect(() => {
    if (value !== undefined) setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const v = e.target.value;
    setLocalValue(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(v), debounceMs);
  };

  const handleClear = () => {
    setLocalValue("");
    clearTimeout(timerRef.current);
    onChange("");
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        size={14}
        className="absolute left-3 text-zinc-500 pointer-events-none"
      />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="
          w-full pl-8 pr-8 py-2 rounded-xl text-[11px]
          bg-zinc-800 border border-zinc-700 text-white
          placeholder:text-zinc-500
          focus:outline-none focus:border-purple-500
          transition-colors duration-200
        "
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}