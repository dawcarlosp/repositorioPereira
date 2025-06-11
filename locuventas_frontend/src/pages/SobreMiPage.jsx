// src/pages/SobreMiPage.jsx
import FormVendedorLogin from "../components/vendedor/Form/FormVendedorLogin";
import FooterLogin from "../components/FooterLogin";
import SobreMi from "../components/SobreMi";
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#18181b]">
      <main className="flex-1 flex flex-col justify-center items-center">
        <SobreMi/>
      </main>
      <FooterLogin hacia={'/Dashboard'} texto={'Volver'}/>
    </div>
  );
}
