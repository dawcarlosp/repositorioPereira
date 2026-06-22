// src/pages/SobreMiPage.jsx
import SobreMi from "@components/dev/SobreMi";
import FooterLogin from "@components/FooterLogin";

export default function SobreMiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#18181b]">
      <main className="flex-1 flex flex-col justify-center items-center">
        <SobreMi />
      </main>
      <FooterLogin modo="volver" />
    </div>
  );
}