import { ChevronDown } from "lucide-react";
import { useSelectLogic, SelectDropdown, THEME_FIELDSET } from "./SelectBase";
import type { SelectOption } from "@domain/ui.types";

interface SelectFormProps {
  id:                string;
  value:             string | number | (string | number)[];
  onChange:          (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string | number } }) => void;
  placeholder?:      string;
  required?:         boolean;
  options?:          SelectOption[];
  multiple?:         boolean;
  disabled?:         boolean;
  searchPlaceholder?: string;
}

export default function SelectForm({
  id,
  value,
  onChange,
  placeholder,
  required = false,
  options = [],
  multiple = false,
  disabled = false,
  searchPlaceholder = "Buscar...",
}: SelectFormProps) {
  const { open, setOpen, ref, query, handleChange, handleClear, selectedOption, filtered } = useSelectLogic({ options, value: value as string | number | undefined });

  const handleSelect = (optValue: string | number) => {
    onChange({ target: { value: optValue } });
    setOpen(false);
  };

  if (multiple) {
    return (
      <select
        id={id}
        value={(Array.isArray(value) ? value : [value]).map(String)}
        onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
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

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`
          ${THEME_FIELDSET.trigger}
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
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <SelectDropdown
          query={query}
          onQueryChange={handleChange}
          onQueryClear={handleClear}
          filtered={filtered}
          options={options}
          value={value as string | number}
          onSelect={handleSelect}
          placeholder="Selecciona..."
          searchPlaceholder={searchPlaceholder}
          theme={THEME_FIELDSET}
        />
      )}
    </div>
  );
}
