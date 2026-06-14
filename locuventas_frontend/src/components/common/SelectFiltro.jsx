// src/components/common/SelectFiltro.jsx
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import useBuscador from "@hooks/useBuscador";

export default function SelectFiltro({
  id,
  value,
  onChange,
  placeholder = "Filtrar...",
  options = [],
  disabled = false,
  searchPlaceholder = "Buscar...",
}) {
  const [open, setOpen] = useState(false);
  const { query, setQuery, inputRef: searchRef, handleChange, handleClear } = useBuscador();
  const ref = useRef(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  const filtered = query.trim()
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  // Cierra al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus automático al abrir, limpiar al cerrar
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  const handleSelect = (optValue) => {
    onChange({ target: { value: optValue } });
    setOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) setOpen((o) => !o);
  };

  return (
    <div ref={ref} className="relative w-full flex-shrink-0">
      {/* Trigger */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`
          w-full h-9 flex items-center gap-2 px-3
          bg-zinc-800 rounded-xl border transition-all text-left
          focus:outline-none text-[11px]
          ${open
            ? "border-purple-500 ring-1 ring-purple-500"
            : "border-zinc-700 hover:border-zinc-500"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {/* Imagen del item seleccionado (ej: bandera de país) */}
        {selectedOption?.image && (
          <img
            src={selectedOption.image}
            alt={selectedOption.label}
            className="w-5 h-3.5 rounded-sm object-cover flex-shrink-0"
          />
        )}

        <span className={`flex-1 truncate ${selectedOption ? "text-white" : "text-zinc-500"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* X para limpiar si hay selección, chevron si no */}
        {selectedOption ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect("");
            }}
            className="text-zinc-500 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        ) : (
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-500 flex-shrink-0 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[160px] bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">

          {/* Buscador interno */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800">
            <Search className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 text-[11px] text-white bg-transparent focus:outline-none placeholder-zinc-600 min-w-0"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="text-zinc-500 hover:text-white flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Lista */}
          <ul className="max-h-48 overflow-y-auto custom-scrollbar py-1">
            {/* Opción vacía para limpiar — solo si no hay búsqueda activa */}
            {!query && (
              <li>
                <button
                  type="button"
                  onClick={() => handleSelect("")}
                  className="w-full px-3 py-2 text-left text-[11px] text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 transition-colors"
                >
                  {placeholder}
                </button>
              </li>
            )}

            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-[11px] text-zinc-600 text-center italic">
                Sin resultados para "{query}"
              </li>
            ) : (
              filtered.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`
                      w-full px-3 py-2 text-left text-[11px] flex items-center gap-2
                      transition-colors
                      ${String(opt.value) === String(value)
                        ? "bg-purple-500/10 text-purple-400"
                        : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      }
                    `}
                  >
                    {opt.image && (
                      <img
                        src={opt.image}
                        alt={opt.label}
                        className="w-5 h-3.5 rounded-sm object-cover flex-shrink-0"
                      />
                    )}
                    <span className="truncate">{opt.label}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}