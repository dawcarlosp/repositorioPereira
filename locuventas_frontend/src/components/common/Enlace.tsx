import type { ReactNode, ButtonHTMLAttributes } from "react";

interface EnlaceProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Enlace({ children, disabled, onClick }: EnlaceProps) {
  return (
    <button
      className={`text-blue-500 hover:scale-105 cursor-pointer font-bold ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
