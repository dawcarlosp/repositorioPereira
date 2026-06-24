// src/components/common/InputFieldset.tsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldsetProps {
  type?:         string;
  id:            string;
  value:         string;
  onChange:      (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder:   string;
  required?:     boolean;
  onBlur?:       (e: React.FocusEvent<HTMLInputElement>) => void;
  customClasses?: string;
}

export default function InputFieldset({
  type = "text",
  id,
  value,
  onChange,
  placeholder,
  required = false,
  onBlur,
  customClasses = "bg-white border-gray-300 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500",
}: InputFieldsetProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label
      className={`
        relative block w-full max-w-xs mx-auto
        min-h-[52px] flex-shrink-0
        rounded-xl shadow-md transition-all mb-2
        overflow-hidden ${customClasses}
      `}
    >
      <input
        type={type === "password" && showPassword ? "text" : type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder=" "
        required={required}
        onBlur={onBlur}
        className="peer w-full min-w-0 h-[52px] py-0 px-4 pt-4 text-gray-700 text-base bg-transparent focus:outline-none placeholder-transparent"
      />
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-3 peer-focus:text-xs peer-focus:text-purple-500 peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-purple-500">
        {placeholder}
      </span>
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-500"
          tabIndex={-1}
        >
          {showPassword
            ? <EyeOff className="w-5 h-5 cursor-pointer" />
            : <Eye    className="w-5 h-5 cursor-pointer" />
          }
        </button>
      )}
    </label>
  );
}