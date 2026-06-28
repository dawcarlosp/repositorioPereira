import type { CarritoItem } from "../hooks/useCarrito";
import CarritoVenta from "./CarritoVentas";

interface Props {
  isOpen:         boolean;
  onClose:        () => void;
  carga:          CarritoItem[];
  quitarProducto: (id: number) => void;
  onGuardar:      () => void;
  onCobrar:       () => void;
}

export default function DrawerCarrito({ isOpen, onClose, ...props }: Props) {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-[400px] bg-zinc-900 z-[10001] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        <div className="absolute top-4 left-4 z-[10002]">
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors border border-zinc-700 shadow-lg"
            aria-label="Cerrar carrito"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        <div className="flex-1 overflow-hidden pt-12"> 
          <CarritoVenta {...props} />
        </div>
      </div>
    </>
  );
}
