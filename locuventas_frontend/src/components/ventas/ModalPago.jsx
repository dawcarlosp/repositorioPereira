import React, { useState } from "react";
import BaseModal from "@components/common/BaseModal";
import Boton from "@buttons/Boton";
import BotonClaro from "@buttons/BotonClaro";

export default function ModalPago({
  totalPendiente,
  onConfirmar,
  onCancelar,
  confirmText = "Cobrar",
}) {
  const [monto, setMonto] = useState(totalPendiente || "");
  const [error, setError] = useState("");

  const handleInput = (e) => {
    const val = e.target.value.replace(",", ".");
    if (/^\d*\.?\d{0,2}$/.test(val)) setMonto(val);
  };

  const handleConfirm = () => {
    const valor = parseFloat(monto);
    if (!valor || isNaN(valor) || valor <= 0) {
      setError("Introduce un importe válido");
      return;
    }
    if (valor > totalPendiente) {
      setError("No puedes cobrar más de lo pendiente");
      return;
    }
    setError("");
    onConfirmar(valor);
  };

  return (
    <BaseModal
      title="¿Cuánto efectivo recibes?"
      onClose={onCancelar}
      footer={
        <>
          <BotonClaro onClick={handleConfirm} className="w-full text-base py-3 rounded-xl">
            {confirmText}
          </BotonClaro>
          <Boton onClick={onCancelar} className="w-full text-base py-3 rounded-xl">
            Cancelar
          </Boton>
        </>
      }
      contentClassName="flex flex-col gap-4 w-full items-center"
    >
      <input
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0"
        max={totalPendiente}
        value={monto}
        onChange={handleInput}
        placeholder={`Máximo ${totalPendiente}€`}
        className="w-full px-4 py-3 rounded-xl text-lg text-zinc-900 bg-white shadow border-2 border-orange-300 focus:border-orange-500 outline-none"
        autoFocus
      />
      <div className="text-orange-400 text-base mt-2 font-semibold">
        Pendiente: {totalPendiente} €
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </BaseModal>
  );
}
