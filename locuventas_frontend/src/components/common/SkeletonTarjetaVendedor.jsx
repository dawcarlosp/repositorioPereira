// src/components/common/SkeletonTarjetaVendedor.jsx
export default function SkeletonTarjetaVendedor() {
  return (
    <li className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-zinc-700 flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 w-32 rounded-md bg-zinc-700" />
        <div className="h-2 w-48 rounded-md bg-zinc-700/70" />
        <div className="h-2 w-20 rounded-md bg-zinc-700/50" />
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        <div className="h-7 w-20 rounded-xl bg-zinc-700" />
        <div className="h-7 w-20 rounded-xl bg-zinc-700/70" />
      </div>
    </li>
  );
}