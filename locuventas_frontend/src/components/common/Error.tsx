import type { ReactNode } from "react";

interface ErrorProps {
  children?:  ReactNode;
  className?: string;
  onClick?:   () => void;
}

export default function Error({ children, className = "", onClick }: ErrorProps) {
  if (!children) return null;

  return (
    <span
      className={`text-orange-600 bg-white p-2 mb-2 rounded-xs text-sm mt-1 block animate-fadeIn ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
