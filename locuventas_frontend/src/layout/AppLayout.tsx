import type { ReactNode } from "react";
import Header from "@layout/Header/Header";
import Footer from "@layout/Footer";
import useBreakpoint from "@hooks/useBreakpoint";
import { isBreakpoint, BREAKPOINT_GROUPS } from "@constants/breakpoints";

interface Props {
  children: ReactNode;
  aside?:   ReactNode;
}

export default function AppLayout({ children, aside }: Props) {
  const bp = useBreakpoint();

  const showAside = isBreakpoint(bp, "DESKTOP") && aside;

  const showFooter = !isBreakpoint(bp, "MOBILE");

  return (
    <div className="h-screen flex flex-col bg-zinc-900 overflow-hidden text-zinc-100">
      <Header />
      <div className="flex-1 flex flex-col md:flex-row min-h-0 w-full py-2 px-2 gap-2 overflow-hidden">

        <main className="flex-1 flex flex-col items-center min-h-0 overflow-hidden">
          {children}
        </main>

        {showAside && (
          <aside className="hidden md:flex flex-col h-full w-96 shrink-0 overflow-hidden">
            {aside}
          </aside>
        )}
      </div>

      {showFooter && <Footer />}
    </div>
  );
}
