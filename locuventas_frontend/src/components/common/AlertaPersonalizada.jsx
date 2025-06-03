import React from "react";
import { X } from "lucide-react";

function AlertaPersonalizada({ mensaje, onClose }) {
  if (!mensaje) return null;

  return (
    <div
      className="fixed top-5 right-5 z-50 rounded-xl p-4 shadow-xl bg-white/30 backdrop-blur-lg border border-white/40
      text-gray-900 flex items-center gap-4 animate-fade-in"
    >
      <span className="text-sm">{mensaje}</span>
      <button
        onClick={onClose}
        className="p-1 rounded-full hover:bg-white/40 transition"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default AlertaPersonalizada;
