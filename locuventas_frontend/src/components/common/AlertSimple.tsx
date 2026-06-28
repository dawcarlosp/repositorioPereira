import BaseModal from "@components/common/BaseModal";
import Button from "@buttons/Button";

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
        <Button onClick={onClose} className="w-full text-base py-3 rounded-xl">
          Entendido
        </Button>
      }
    />
  );
}
