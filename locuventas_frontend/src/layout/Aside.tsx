import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Aside({ children }: Props) {
  return (
    <aside className="w-full h-full bg-zinc-900 flex flex-col border-l border-zinc-800 shadow-2xl overflow-hidden">
      {children}
    </aside>
  );
}
