import Button from "@buttons/Button";
import {
  CircleArrowLeft,
  CircleArrowRight,
  CircleArrowDown,
  CircleArrowUp,
} from "lucide-react";
import type { ReactNode } from "react";

interface MenuButtonProps {
  label:       string;
  onClick?:    () => void;
  isActive?:   boolean;
  hasChildren?: boolean;
  variant?:    "purple" | "orange";
  isMobile?:   boolean;
  className?:  string;
  ref?:        React.RefObject<HTMLButtonElement | null>;
  children?:   ReactNode;
}

export default function MenuButton({
  label,
  onClick,
  isActive,
  hasChildren,
  variant = "purple",
  isMobile = false,
  className = "",
  ref,
}: MenuButtonProps) {
  const activeStyles: Record<string, string> = {
    orange: "text-orange-400 bg-orange-500/10 ring-1 ring-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]",
    purple: "text-purple-400 bg-purple-500/10 ring-1 ring-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
  };

  const currentActiveClass = isActive ? activeStyles[variant] : "";

  const renderIcon = () => {
    if (!hasChildren) return null;

    if (isMobile) {
      return isActive
        ? <CircleArrowUp size={16} className="transition-transform duration-300" />
        : <CircleArrowDown size={16} className="transition-transform duration-300" />;
    }

    return isActive
      ? <CircleArrowRight className="opacity-50 transition-all" size={16} />
      : <CircleArrowLeft className="text-purple-500 transition-all" size={16} />;
  };

  return (
    <Button
      variant="secondary"
      ref={ref}
      onClick={onClick}
      className={`
        flex items-center justify-between !text-[10px] uppercase tracking-[0.2em]
        ${currentActiveClass}
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        {renderIcon()}
        <span>{label}</span>
      </div>
    </Button>
  );
}
