// src/pages/LoginPage.jsx
import FormVendedorLogin from "../components/vendedor/Form/FormVendedorLogin";
import FooterLogin from "../components/FooterLogin";

export default function LoginPage({ setIsOpen }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#18181b]">
      <main className="flex-1 flex flex-col justify-center items-center">
        <FormVendedorLogin setIsOpen={setIsOpen} />
      </main>
      <FooterLogin hacia={'/aboutme'} texto={'Perfil del desarrollador'}/>
    </div>
  );
}
