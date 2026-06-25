import { Check, AlertCircle } from "lucide-react";
import InputFieldset from "@components/common/InputFieldset";

interface InputFieldsetValidacionesProps {
  type?:        string;
  id?:          string;
  value?:       string;
  onChange?:    (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?:    boolean;
  error?:       string | null;
  touched?:     boolean;
  onBlur?:      () => void;
}

export default function InputFieldsetValidaciones({
  type = "text",
  id,
  value,
  onChange,
  placeholder,
  required = false,
  error = null,
  touched = false,
  onBlur,
}: InputFieldsetValidacionesProps) {
  const isValid = touched && !error && value;
  const isInvalid = touched && !!error;

  const validationStyles = `
    bg-purple-100 
    ${isValid 
      ? "border-2 border-purple-500" 
      : isInvalid 
      ? "border-2 border-orange-700" 
      : "border border-gray-300"
    }
  `;

  return (
    <div className="block w-full max-w-xs mb-2 mx-auto relative">

      <InputFieldset
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        onBlur={onBlur}
        customClasses={validationStyles}
      />

      {isValid && (
        <Check className="absolute right-4 top-[26px] transform -translate-y-1/2 text-purple-500 w-5 h-5 pointer-events-none" />
      )}
      {isInvalid && (
        <AlertCircle className="absolute right-4 top-[26px] transform -translate-y-1/2 text-orange-700 w-5 h-5 pointer-events-none" />
      )}

      <div
        className={`text-xs mt-1 px-3 py-1 rounded-lg font-medium transition-all min-h-[24px]
          ${isInvalid ? "text-orange-700 bg-white/90 shadow" : "bg-transparent"}`}
        style={{ minHeight: 24 }}
      >
        {isInvalid ? error : ""}
      </div>
    </div>
  );
}
