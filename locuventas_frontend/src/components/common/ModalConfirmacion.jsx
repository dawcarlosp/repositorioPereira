// src/components/common/ModalConfirmacion.jsx
import ReactDOM from "react-dom";
import Boton from "./Boton";
import BotonClaro from "./BotonClaro";

export default function ModalConfirmacion({ mensaje, onConfirmar, onCancelar }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-wide">{mensaje}</h2>
        <div className="flex flex-col gap-3 w-full">
          <BotonClaro onClick={onConfirmar}>Sí, cerrar sesión</BotonClaro>
          <Boton onClick={onCancelar}>Cancelar</Boton>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
}
