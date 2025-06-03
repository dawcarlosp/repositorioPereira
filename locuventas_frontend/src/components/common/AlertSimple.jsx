// src/components/common/AlertSimple.jsx
import ReactDOM from "react-dom";
import Boton from "./Boton";

export default function AlertSimple({ mensaje, onClose }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center">
        <h2 className="text-lg md:text-xl font-bold tracking-wide">
          {mensaje}
        </h2>
        <div className="mt-6">
          <Boton onClick={onClose}>Entendido</Boton>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
}
