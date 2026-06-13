// src/components/common/BuscadorInput.jsx
import React, { useEffect } from "react";
import { Search, X } from "lucide-react";
import useBuscador from "@hooks/useBuscador";

export default function BuscadorInput({
  value,
  onChange,
  placeholder = "Buscar...",
  debounceMs = 400,
  className = "",
}) {
  const { query, setQuery, inputRef, handleChange, handleClear } = useBuscador({
    debounceMs,
    onSearch: onChange,
  });

  // Sincronizar si el padre resetea el valor externamente
  useEffect(() => {
    if (value !== undefined) setQuery(value);
  }, [value]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search size={14} className="absolute left-3 text-zinc-500 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-8 pr-8 py-2 rounded-xl text-[11px]
          bg-zinc-800 border border-zinc-700 text-white
          placeholder:text-zinc-500
          focus:outline-none focus:border-purple-500
          transition-colors duration-200
        "
      />
      {query && (
        <button onClick={handleClear} className="absolute right-3 text-zinc-500 hover:text-white transition-colors">
          <X size={12} />
        </button>
      )}
    </div>
  );
}