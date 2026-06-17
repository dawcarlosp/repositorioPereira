import React from "react";
import Header from "@layout/Header/Header";
import Footer from "@layout/Footer";
import useBreakpoint from "@hooks/useBreakpoint";
import { isBreakpoint, BREAKPOINT_GROUPS } from "@constants/breakpoints";

export default function AppLayout({ children, aside }) {
  const bp = useBreakpoint();

  // Mostrar aside solo en pantallas grandes (lg, xl, 2xl)
  const showAside = isBreakpoint(bp, "DESKTOP") && aside;

  // Mostrar footer en todas excepto en móvil (xs, sm)
  const showFooter = !isBreakpoint(bp, "MOBILE");

  return (
    <div className="h-screen flex flex-col bg-zinc-900 overflow-hidden text-zinc-100">
      <Header />
      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 w-full py-2 px-2 gap-2 overflow-hidden">

        {/* El Main (Contenido principal) */}
        <main className="flex-1 flex flex-col items-center min-h-0 overflow-hidden">
          {children}
        </main>

        {/* Aside: Solo se renderiza en pantallas grandes */}
        {showAside && (
          <aside className="hidden md:flex flex-col h-full w-96 shrink-0 overflow-hidden">
            {aside}
          </aside>
        )}
      </div>

      {/* Footer: Visible en todas excepto móvil */}
      {showFooter && <Footer />}
    </div>
  );
}