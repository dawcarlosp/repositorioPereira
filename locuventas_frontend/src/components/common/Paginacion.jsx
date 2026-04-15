import React from "react";
import Boton from "@components/common/Boton";

export default function Paginacion({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-4 items-center justify-center mt-4 bg-zinc-900/30 p-2 rounded-2xl border border-zinc-800/50">
      <Boton
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        className="!px-3 !py-1 w-auto" // Usamos ! para asegurar que sea pequeño
      >
        &lt;
      </Boton>
      
      <span className="text-sm text-zinc-400 font-medium uppercase tracking-tighter">
        Página <b className="text-orange-400">{page + 1}</b> de <b className="text-white">{totalPages}</b>
      </span>
      
      <Boton
        disabled={page + 1 >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="!px-3 !py-1 w-auto"
      >
        &gt;
      </Boton>
    </div>
  );
}