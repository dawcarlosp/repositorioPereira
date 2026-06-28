import BaseModal from "@components/common/BaseModal";
import Button from "@buttons/Button";

interface ModalConfirmacionProps {
  mensaje:      string;
  confirmText?: string;
  onConfirmar?: () => void | Promise<void>;
  onCancelar?:  () => void;
}

export default function ModalConfirmacion({
  mensaje,
  confirmText = "Sí",
  onConfirmar,
  onCancelar,
}: ModalConfirmacionProps) {
  return (
    <BaseModal
      title={mensaje}
      onClose={onCancelar}
      footer={
        <>
          <Button variant="secondary" onClick={onConfirmar} className="w-full text-base py-3 rounded-xl">
            {confirmText}
          </Button>
          <Button onClick={onCancelar} className="w-full text-base py-3 rounded-xl">
            Cancelar
          </Button>
        </>
      }
    />
  );
}
