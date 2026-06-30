import { forwardRef } from "react";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import { X } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "link" | "close";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: number;
}

const variants: Record<ButtonVariant, string> = {
  primary: [
    "px-4 py-2 font-semibold rounded-xl transition-all duration-300",
    "text-white bg-zinc-900 tracking-wide cursor-pointer",
    "ring-2 ring-purple-500/50 shadow-[0_0_12px_2px_rgba(168,85,247,0.6)]",
    "hover:ring-purple-500 hover:shadow-[0_0_18px_4px_rgba(168,85,247,0.6)]",
    "hover:scale-105",
    "disabled:opacity-60 disabled:cursor-not-allowed disabled:ring-2 disabled:ring-purple-500 disabled:shadow-none",
  ].join(" "),
  secondary: [
    "w-full py-2 px-4 rounded-xl font-semibold tracking-wide transition-all duration-300 cursor-pointer",
    "bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-105",
    "disabled:bg-zinc-700 disabled:text-gray-300 disabled:cursor-not-allowed disabled:opacity-60",
  ].join(" "),
  link: [
    "text-blue-500 hover:scale-105 cursor-pointer font-bold",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
  close: [
    "border bg-orange-500/2 text-white hover:bg-purple-500 p-1 rounded-xl cursor-pointer hover:scale-105",
  ].join(" "),
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", children, className = "", size = 20, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {variant === "close" && !children ? <X size={size} /> : children}
    </button>
  );
});

export default Button;
export type { ButtonVariant, ButtonProps };
