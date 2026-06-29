import { useEffect, useRef, useState } from "react";
import useBuscador from "@hooks/useBuscador";
import { Search, X } from "lucide-react";
import type { SelectOption } from "@domain/ui.types";

export interface SelectTheme {
  trigger: string;
  dropdown: string;
  searchInput: string;
  option: string;
  optionActive: string;
  placeholder: string;
  noResults: string;
  searchIcon: string;
  clearIcon: string;
}

export const THEME_FIELDSET: SelectTheme = {
  trigger:
    "w-full h-[52px] flex items-center gap-2.5 px-4 bg-white rounded-xl border shadow-md transition-all text-left focus:outline-none",
  dropdown:
    "absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden",
  searchInput:
    "flex-1 text-sm text-gray-700 bg-transparent focus:outline-none placeholder-gray-400 min-w-0",
  option:
    "w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 hover:bg-purple-50 transition-colors text-gray-700",
  optionActive:
    "bg-purple-50 text-purple-700 font-medium",
  placeholder:
    "text-gray-400",
  noResults:
    "px-4 py-3 text-sm text-gray-400 text-center",
  searchIcon:
    "w-4 h-4 text-gray-400 flex-shrink-0",
  clearIcon:
    "text-gray-400 hover:text-gray-600 flex-shrink-0",
};

export const THEME_FILTER: SelectTheme = {
  trigger:
    "w-full h-9 flex items-center gap-2 px-3 bg-zinc-800 rounded-xl border transition-all text-left focus:outline-none text-[11px]",
  dropdown:
    "absolute z-50 mt-1 w-full min-w-[160px] bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden",
  searchInput:
    "flex-1 text-[11px] text-white bg-transparent focus:outline-none placeholder-zinc-600 min-w-0",
  option:
    "w-full px-3 py-2 text-left text-[11px] flex items-center gap-2 transition-colors text-zinc-300 hover:bg-zinc-800 hover:text-white",
  optionActive:
    "bg-purple-500/10 text-purple-400",
  placeholder:
    "text-zinc-500",
  noResults:
    "px-3 py-3 text-[11px] text-zinc-600 text-center italic",
  searchIcon:
    "w-3.5 h-3.5 text-zinc-500 flex-shrink-0",
  clearIcon:
    "text-zinc-500 hover:text-white flex-shrink-0",
};

export interface UseSelectLogicOptions<T extends SelectOption = SelectOption> {
  options: T[];
  value?: string | number;
}

export function useSelectLogic<T extends SelectOption = SelectOption>({
  options,
  value,
}: UseSelectLogicOptions<T>) {
  const [open, setOpen] = useState(false);
  const { query, setQuery, inputRef, handleChange, handleClear } = useBuscador();
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value)) ?? null;

  const filtered = query.trim()
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase()),
      )
    : options;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setQuery]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open, setQuery, inputRef]);

  return {
    open,
    setOpen,
    ref,
    query,
    setQuery,
    inputRef,
    handleChange,
    handleClear,
    selectedOption,
    filtered,
  };
}

interface SelectDropdownProps {
  query: string;
  onQueryChange: (val: string) => void;
  onQueryClear: () => void;
  filtered: SelectOption[];
  options: SelectOption[];
  value?: string | number;
  onSelect: (optValue: string | number) => void;
  placeholder: string;
  searchPlaceholder: string;
  theme: SelectTheme;
}

export function SelectDropdown({
  query,
  onQueryChange,
  onQueryClear,
  filtered,
  options,
  value,
  onSelect,
  placeholder,
  searchPlaceholder,
  theme,
}: SelectDropdownProps) {
  return (
    <div className={theme.dropdown}>
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-zinc-800">
        <Search className={theme.searchIcon} />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={searchPlaceholder}
          className={theme.searchInput}
        />
        {query && (
          <button type="button" onClick={onQueryClear} className={theme.clearIcon}>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <ul className="max-h-48 overflow-y-auto custom-scrollbar py-1">
        {!query && options.length > 0 && (
          <li>
            <button
              type="button"
              onClick={() => onSelect("")}
              className={theme.option}
            >
              {placeholder}
            </button>
          </li>
        )}

        {filtered.length === 0 ? (
          <li className={theme.noResults}>
            Sin resultados para "{query}"
          </li>
        ) : (
          filtered.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => onSelect(opt.value)}
                className={`${theme.option} ${
                  String(opt.value) === String(value) ? theme.optionActive : ""
                }`}
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
  );
}
