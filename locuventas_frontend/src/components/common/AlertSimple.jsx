// src/components/common/AlertSimple.jsx
import BaseModal from "@components/common/BaseModal";
import Boton from "@buttons/Boton";

export default function AlertSimple({ mensaje, onClose }) {
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
