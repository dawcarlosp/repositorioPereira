// src/hooks/useBuscador.js
import { useState, useRef, useEffect } from "react";

export default function useBuscador({ debounceMs = 400, onSearch } = {}) {
  const [query, setQuery]   = useState("");
  const timerRef            = useRef(null);
  const inputRef            = useRef(null);

  // Debounce opcional — si no se pasa onSearch, solo gestiona el estado local
  const handleChange = (value) => {
    setQuery(value);
    if (onSearch) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onSearch(value), debounceMs);
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
    clearTimeout(timerRef.current);
  };

  // Limpiar timer al desmontar
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { query, setQuery, inputRef, handleChange, handleClear };
}