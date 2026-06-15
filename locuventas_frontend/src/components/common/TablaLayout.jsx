// src/components/common/TablaLayout.jsx
import React from "react";

const FilaSkeleton = ({ cols }) => (
  <tr className="animate-pulse border-b border-zinc-800/50">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-5">
        <div className={`h-3 bg-zinc-700/50 rounded-full ${
          i === 0 ? "w-10" : i === cols - 1 ? "w-16 ml-auto" : "w-full"
        }`} />
      </td>
    ))}
  </tr>
);

export default function TablaLayout({
  children,
  columnas = [],
  loading = false,
  size,
}) {
  return (
    <div className="flex flex-col bg-zinc-800/50 border border-zinc-700/50 rounded-2xl shadow-2xl overflow-hidden">
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-zinc-700/50">
              {columnas.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-4 bg-zinc-800 text-zinc-400 font-semibold text-xs uppercase tracking-wider ${col.className ?? ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading
              ? Array.from({ length: size ?? 10 }).map((_, i) => (
                  <FilaSkeleton key={i} cols={columnas.length} />
                ))
              : children
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}