import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

function SelectFieldset({
  id,
  value,
  onChange,
  placeholder,
  required = false,
  options = [],
  multiple = false,
  disabled = false,
  searchPlaceholder = "Buscar...",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  const selectedOption = !multiple
    ? options.find((opt) => String(opt.value) === String(value))
    : null;

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

  // Focus automático en el buscador al abrir
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

  // Select múltiple nativo — sin buscador (caso de uso distinto)
  if (multiple) {
    return (
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        multiple
        disabled={disabled}
        className={`
          w-full py-3 px-4 text-gray-700 text-sm bg-white rounded-xl
          border border-gray-300 shadow-md
          focus:border-purple-500 focus:ring-2 focus:ring-purple-500
          transition-all flex-shrink-0
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        style={{ minHeight: 110 }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div ref={ref} className="relative w-full flex-shrink-0">
      {placeholder && (
        <label htmlFor={id} className="block text-purple-500 font-medium text-xs mb-1">
          {placeholder}
          {required && <span className="text-orange-500"> *</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`
          w-full h-[52px] flex items-center gap-2.5 px-4
          bg-white rounded-xl border shadow-md transition-all text-left
          focus:outline-none
          ${open ? "border-purple-500 ring-2 ring-purple-500" : "border-gray-300"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-purple-400"}
        `}
      >
        {selectedOption?.image && (
          <img
            src={selectedOption.image}
            alt={selectedOption.label}
            className="w-6 h-4 rounded-sm object-cover flex-shrink-0 shadow-sm"
          />
        )}
        <span className={`flex-1 text-base truncate ${selectedOption ? "text-gray-700" : "text-gray-400"}`}>
          {selectedOption ? selectedOption.label : "Selecciona..."}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          
          {/* Buscador */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none placeholder-gray-400 min-w-0"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Lista */}
          <ul className="max-h-48 overflow-y-auto custom-scrollbar py-1">
            {!query && (
              <li>
                <button
                  type="button"
                  onClick={() => handleSelect("")}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-400 hover:bg-purple-50 transition-colors"
                >
                  Selecciona...
                </button>
              </li>
            )}

            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">
                Sin resultados para "{query}"
              </li>
            ) : (
              filtered.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`
                      w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5
                      hover:bg-purple-50 transition-colors
                      ${String(opt.value) === String(value)
                        ? "bg-purple-50 text-purple-700 font-medium"
                        : "text-gray-700"}
                    `}
                  >
                    {opt.image && (
                      <img
                        src={opt.image}
                        alt={opt.label}
                        className="w-6 h-4 rounded-sm object-cover flex-shrink-0 shadow-sm"
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

export default SelectFieldset;