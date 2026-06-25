import { forwardRef } from "react";
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface BotonClaroProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const BotonClaro = forwardRef<HTMLButtonElement, BotonClaroProps>(function BotonClaro(
  { children, disabled, onClick, className = "", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-2 px-4 rounded-xl font-semibold tracking-wide transition-all duration-300
        ${disabled
          ? "bg-zinc-700 text-gray-300 cursor-not-allowed opacity-60"
          : "bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-105 cursor-pointer"}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
});

export default BotonClaro;
