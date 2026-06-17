import React from "react";
import BaseModal from "@components/common/BaseModal";
import Boton from "@buttons/Boton";
import BotonClaro from "@buttons/BotonClaro";

export default function ModalConfirmacion({
  mensaje,
  confirmText = "Sí",
  onConfirmar,
  onCancelar,
}) {
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
