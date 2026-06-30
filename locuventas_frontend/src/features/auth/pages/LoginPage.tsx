import FormVendedorLogin from "@/features/auth/components/Form/FormVendedorLogin";
import FooterLogin from "@components/common/FooterLogin";
import AppLayout from "@layout/AppLayout";

interface Props {
  setIsOpen: (v: boolean) => void;
}

export default function LoginPage({ setIsOpen }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 text-zinc-100">
      <div className="flex-1 flex flex-col justify-between items-center w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 gap-6">
        
        <div className="w-full flex-1 flex items-center justify-center">
          <FormVendedorLogin setIsOpen={setIsOpen} />
        </div>
        
        <div className="w-full shrink-0">
          <FooterLogin/>
        </div>

      </div>
    </div>
  );
}
