import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useBreakpoint from "@/hooks/useBreakpoint";
import FormVendedorRegister from "@components/vendedor/Form/FormVendedorRegister";
import { AppProviders } from "./providers";
import { AppRoutes } from "./routes";
import "@/app/App.css";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  const toastPosition = isMobile ? "top-center" : "top-right";

  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes setIsOpen={setIsOpen} />
        <FormVendedorRegister isOpen={isOpen} setIsOpen={setIsOpen} />
        <ToastContainer
          position={toastPosition}
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          portalId="toast-portal"
          toastClassName="bg-white/30 backdrop-blur-lg text-gray-900 rounded-xl p-4 shadow-lg border border-white/40"
          bodyClassName="text-sm font-medium"
        />
      </BrowserRouter>
    </AppProviders>
  );
}
