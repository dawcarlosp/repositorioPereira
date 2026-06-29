export default function SkeletonProductoGestionCard() {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-700 flex flex-col gap-3 p-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-3 w-8 bg-zinc-700 rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-14 bg-zinc-700 rounded-xl" />
          <div className="h-8 w-16 bg-zinc-700 rounded-xl" />
        </div>
      </div>
      <div className="h-28 bg-zinc-800 rounded-xl border border-zinc-700/30" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-3 w-16 bg-zinc-700/50 rounded" />
            <div className="h-3 w-24 bg-zinc-700/50 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
