import Button from "@buttons/Button";
import type { ReactNode } from "react";

interface FABProps {
  icon:     ReactNode;
  label?:   string | null;
  onClick?: () => void;
  index?:   number;
  variant?: string;
  title?: string;
}

export default function FAB({
  icon,
  label = null,
  onClick,
  index = 0,
  variant = "!bg-zinc-900",
  title
}: FABProps) {
  const bottomOffset = 1.5 + (index * 4.75);

  return (
    <div
      className="fixed right-6 z-[9999] animate-in fade-in zoom-in duration-300"
      style={{ bottom: `${bottomOffset}rem` }}
    >
      <Button
        onClick={onClick}
        title={title}
        className={`
          ${variant}
          !h-16 !rounded-full !px-4
          min-w-[64px]
          flex items-center justify-center gap-2
          shadow-2xl border border-white/10
        `}
      >
        <span className="text-xl text-white">
          {icon}
        </span>

        {label && (
          <span className="text-lg font-black text-white whitespace-nowrap pr-2">
            {label}
          </span>
        )}
      </Button>
    </div>
  );
}
