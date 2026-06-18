// src/components/productos/SkeletonProductoFila.jsx
export default function SkeletonProductoFila({ cols = 5 }) {
  return (
    <tr className="animate-pulse border-b border-zinc-800/50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-5">
          <div className={`h-3 bg-zinc-700/50 rounded-full ${
            i === 0 ? "w-10" : i === cols - 1 ? "w-20 ml-auto" : "w-full"
          }`} />
        </td>
      ))}
    </tr>
  );
}