import BaseModal from "@components/common/BaseModal";
import Boton from "@buttons/Boton";

interface AlertSimpleProps {
  mensaje: string;
  onClose: () => void;
}

export default function AlertSimple({ mensaje, onClose }: AlertSimpleProps) {
  return (
    <BaseModal
      title={mensaje}
      onClose={onClose}
      footer={
        <Boton onClick={onClose} className="w-full text-base py-3 rounded-xl">
          Entendido
        </Boton>
      }
    />
  );
}
