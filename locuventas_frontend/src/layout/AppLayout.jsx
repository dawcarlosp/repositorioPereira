import React from "react";
import Header from "@layout/Header/Header";
import Footer from "@layout/Footer";
import useBreakpoint from "@hooks/useBreakpoint";
export default function AppLayout({ children, aside }) {
  //Responsive
  const bp = useBreakpoint();
  return (
    <div className="h-screen flex flex-col bg-zinc-900 overflow-hidden text-zinc-100">
      <Header />
      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 w-full py-2 px-2 gap-2 overflow-hidden">

        {/* El Main (Contenido principal) */}
        <main className="flex-1 flex flex-col items-center min-h-0 overflow-hidden">
          {children}
        </main>

        {/* Aside: Solo se renderiza si existe Y si NO es móvil */}
        {bp != "xs" && bp != "sm" && bp != "md" && aside && (
          <aside className="hidden md:flex flex-col h-full w-96 shrink-0 overflow-hidden">
            {aside}
          </aside>
        )}
      </div>

      {/* Footer: Visible a partir de 1024px */}
      {bp != "xs" && bp != "sm" && bp != "md" && <Footer />}
    </div>
  );
}