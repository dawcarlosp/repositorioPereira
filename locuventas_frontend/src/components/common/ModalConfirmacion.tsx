import BaseModal from "@components/common/BaseModal";
import Boton from "@buttons/Boton";
import BotonClaro from "@buttons/BotonClaro";

interface ModalConfirmacionProps {
  mensaje:      string;
  confirmText?: string;
  onConfirmar?: () => void;
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
          <BotonClaro onClick={onConfirmar} className="w-full text-base py-3 rounded-xl">
            {confirmText}
          </BotonClaro>
          <Boton onClick={onCancelar} className="w-full text-base py-3 rounded-xl">
            Cancelar
          </Boton>
        </>
      }
    />
  );
}
