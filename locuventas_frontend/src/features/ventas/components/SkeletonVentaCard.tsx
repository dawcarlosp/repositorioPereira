export default function SkeletonVentaCard() {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-700 flex flex-col gap-3 p-4 w-full animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 w-12 bg-zinc-700 rounded" />
        <div className="h-5 w-16 bg-zinc-700 rounded-full" />
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-3 w-16 bg-zinc-700/50 rounded" />
            <div className="h-3 w-24 bg-zinc-700/50 rounded" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
        <div className="h-8 bg-zinc-700/50 rounded-xl" />
      </div>
    </div>
  );
}
