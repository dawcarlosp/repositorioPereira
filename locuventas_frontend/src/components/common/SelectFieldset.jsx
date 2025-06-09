import React from "react";

/**
 * SelectFieldset: un select estilizado compatible con InputFieldset,
 * pero sin label flotante (el label siempre arriba).
 * Permite opciones simples o con imágenes (flags, etc).
 *
 * props:
 * - id: string
 * - value: string | string[]
 * - onChange: function
 * - placeholder: string (aparece como label arriba)
 * - required: boolean
 * - options: [{ value, label, image }]  // image opcional para banderas
 * - multiple: boolean
 * - disabled: boolean
 */

function SelectFieldset({
  id,
  value,
  onChange,
  placeholder,
  required = false,
  options = [],
  multiple = false,
  disabled = false,
}) {
  // Busca la opción seleccionada para, por ejemplo, mostrar la bandera.
  const selectedOption = !multiple
    ? options.find((opt) => String(opt.value) === String(value))
    : null;

  return (
    <div className="mb-2 w-80">
      {/* LABEL arriba solo si hay placeholder */}
      {placeholder && (
        <label
          htmlFor={id}
          className="block text-purple-500 font-medium mb-1"
        >
          {placeholder}
          {required && <span className="text-orange-500"> *</span>}
        </label>
      )}

      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        multiple={multiple}
        disabled={disabled}
        className={`
          w-full py-4 px-4 text-gray-700 text-base bg-white rounded-xl
          border border-gray-300 shadow-md focus:border-purple-500 focus:ring-2
          focus:ring-purple-500 transition-all
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        style={{
          minHeight: multiple ? 110 : undefined,
        }}
      >
        {!multiple && (
          <option value="">
            Selecciona...
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Si el seleccionado tiene imagen y NO es múltiple, muestra debajo */}
      {!multiple && selectedOption && selectedOption.image && (
        <div className="flex items-center gap-2 mt-3 ml-2">
          <img
            src={selectedOption.image}
            alt={selectedOption.label}
            className="w-8 h-6 rounded shadow border"
          />
          <span className="font-semibold text-lg text-gray-800">
            {selectedOption.label}
          </span>
        </div>
      )}
    </div>
  );
}

export default SelectFieldset;
