import { useState, useEffect } from "react";
import Boton from "@buttons/Boton";

interface PaginacionProps {
  page:         number;
  totalPages:   number;
  onPageChange: (page: number) => void;
  size:         number;
  onSizeChange: (size: number) => void;
}

export default function Paginacion({ page, totalPages, onPageChange, size, onSizeChange }: PaginacionProps) {
  const [inputValue, setInputValue] = useState(size);

  useEffect(() => {
    setInputValue(size);
  }, [size]);

  const confirmarCambio = () => {
    const valorNum = parseInt(String(inputValue));
    if (!isNaN(valorNum) && valorNum > 0 && valorNum !== size) {
      onSizeChange(valorNum);
    } else {
      setInputValue(size);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      confirmarCambio();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center justify-between mt-4 bg-zinc-900/30 p-2 px-4 rounded-2xl border border-zinc-800/50">

      <div className="flex items-center gap-3">
        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
          Registros:
        </span>

        <div className="flex items-center bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden focus-within:ring-1 focus-within:ring-orange-500/50 transition-all">
          <input
            type="number"
            min="1"
            max="200"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            onBlur={confirmarCambio}
            onKeyDown={handleKeyDown}
            className="w-12 bg-transparent text-orange-400 text-xs font-bold px-2 py-1 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
            title="Escribe un número y pulsa Enter"
          />

          <div className="w-[1px] h-4 bg-zinc-700"></div>

          <select
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="bg-transparent text-zinc-400 text-[10px] font-bold px-1 py-1 outline-none cursor-pointer hover:text-white transition-colors"
          >
            <option disabled value="">-</option>
            {[6, 12, 24, 48, 100].map(opt => (
              <option key={opt} value={opt} className="bg-zinc-800 text-white">{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Boton
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          className="!px-3 !py-1 w-auto"
        >
          &lt;
        </Boton>

        <div className="flex items-center gap-1 text-sm text-zinc-400 font-medium uppercase tracking-tighter">
          <span>Página</span>
          <b className="text-orange-400">{page + 1}</b>
          <span className="text-zinc-600">/</span>
          <b className="text-white">{totalPages || 1}</b>
        </div>

        <Boton
          disabled={page + 1 >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="!px-3 !py-1 w-auto"
        >
          &gt;
        </Boton>
      </div>
    </div>
  );
}
