// src/components/common/Paginacion.jsx
export default function Paginacion({ page, totalPages, onPageChange }) {
  return (
    <div className="flex gap-2 items-center justify-center mt-4">
      <button
        className="px-3 py-1 rounded bg-orange-400 text-white font-bold disabled:opacity-40"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        &lt;
      </button>
      <span className="text-white">
        Página <b>{page + 1}</b> de <b>{totalPages}</b>
      </span>
      <button
        className="px-3 py-1 rounded bg-orange-400 text-white font-bold disabled:opacity-40"
        disabled={page + 1 >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        &gt;
      </button>
    </div>
  );
}
