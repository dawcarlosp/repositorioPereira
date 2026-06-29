import { ChevronDown, X } from "lucide-react";
import { useSelectLogic, SelectDropdown, THEME_FILTER } from "./SelectBase";
import type { SelectOption } from "@domain/ui.types";

interface SelectFilterProps {
  id?:               string;
  value?:            string | number;
  onChange?:         (e: { target: { value: string } }) => void;
  placeholder?:      string;
  options?:          SelectOption[];
  disabled?:         boolean;
  searchPlaceholder?: string;
}

export default function SelectFilter({
  id,
  value,
  onChange,
  placeholder = "Filtrar...",
  options = [],
  disabled = false,
  searchPlaceholder = "Buscar...",
}: SelectFilterProps) {
  const { open, setOpen, ref, query, handleChange, handleClear, selectedOption, filtered } = useSelectLogic({ options, value });

  const handleSelect = (optValue: string | number) => {
    onChange?.({ target: { value: String(optValue) } });
    setOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) setOpen((o) => !o);
  };

  return (
    <div ref={ref} className="relative w-full flex-shrink-0">
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`
          ${THEME_FILTER.trigger}
          ${open
            ? "border-purple-500 ring-1 ring-purple-500"
            : "border-zinc-700 hover:border-zinc-500"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
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

      {open && (
        <SelectDropdown
          query={query}
          onQueryChange={handleChange}
          onQueryClear={handleClear}
          filtered={filtered}
          options={options}
          value={value}
          onSelect={handleSelect}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          theme={THEME_FILTER}
        />
      )}
    </div>
  );
}
