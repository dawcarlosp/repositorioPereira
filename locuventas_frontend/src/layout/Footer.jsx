import React from "react";

import VentasNavMenu from "@components/ventas/VentasNavMenu";
export default function Footer() {

  return (
    <div className="w-full mt-auto rounded-t-2xl shadow-2xl">
      <footer className="footer-content flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8 px-4 py-6 rounded-t-2xl border-t border-orange-900/30">
        <VentasNavMenu />
      </footer>
    </div>
  );
}