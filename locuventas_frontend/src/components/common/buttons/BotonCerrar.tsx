import { X } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface BotonCerrarProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?:    number;
  bg?:      string;
  hoverBg?: string;
}

export default function BotonCerrar({
  onClick,
  className = "",
  size = 20,
  bg = "bg-orange-500/2",
  hoverBg = "hover:bg-purple-500",
  ...props
}: BotonCerrarProps) {
  return (
    <button
      type="button"
      className={`border ${bg} text-white ${hoverBg} p-1 rounded-xl cursor-pointer hover:scale-105 self-end me-2 mt-6 ${className}`}
      onClick={onClick}
      {...props}
    >
      <X size={size} />
    </button>
  );
}
