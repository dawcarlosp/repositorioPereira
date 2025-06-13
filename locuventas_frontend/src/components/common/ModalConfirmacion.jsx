import React from "react";
import ReactDOM from "react-dom";
import Boton from "@components/common/Boton";        
import BotonClaro from "@components/common/BotonClaro"; 

export default function ModalConfirmacion({
  mensaje,
  confirmText = "Sí",
  onConfirmar,
  onCancelar,
}) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[1000000] bg-black/70 backdrop-blur-[2px] flex items-center justify-center px-2 sm:px-4">
      <div
        className={`
          bg-zinc-900 text-white rounded-2xl shadow-2xl
          w-full max-w-md mx-auto
          p-5 sm:p-8
          text-center space-y-8
          border border-zinc-700
        `}
        style={{ minWidth: 0 }}
      >
        <h2 className="text-lg sm:text-2xl font-bold tracking-wide">{mensaje}</h2>
        <div className="flex flex-col gap-4 w-full items-center">
          <BotonClaro onClick={onConfirmar} className="w-full text-base py-3 rounded-xl">
            {confirmText}
          </BotonClaro>
          <Boton onClick={onCancelar} className="w-full text-base py-3 rounded-xl">
            Cancelar
          </Boton>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
}
