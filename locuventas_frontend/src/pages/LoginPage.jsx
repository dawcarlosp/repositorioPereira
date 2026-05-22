// src/pages/LoginPage.jsx
import FormVendedorLogin from "@components/vendedor/Form/FormVendedorLogin";
import FooterLogin from "@components/FooterLogin";
import AppLayout from "@layout/AppLayout";

export default function LoginPage({ setIsOpen }) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 text-zinc-100">
      {/* Contenedor principal: se centra en PC y se apila en móvil */}
      <div className="flex-1 flex flex-col justify-between items-center w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 gap-6">
        
        {/* Espacio intermedio para centrar el formulario verticalmente */}
        <div className="w-full flex-1 flex items-center justify-center">
          <FormVendedorLogin setIsOpen={setIsOpen} />
        </div>
        
        {/* El footer siempre se mantendrá abajo */}
        <div className="w-full shrink-0">
          <FooterLogin/>
        </div>

      </div>
    </div>
  );
}
