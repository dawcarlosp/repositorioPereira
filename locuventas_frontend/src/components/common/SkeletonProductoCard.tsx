export default function SkeletonProductoCard() {
  return (
    <div className="relative rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col p-4 gap-3 w-full max-w-[260px] h-[280px] animate-pulse">
      <div className="flex flex-col gap-2 min-h-[44px]">
        <div className="h-2 w-8 rounded bg-zinc-700" />
        <div className="h-4 w-40 rounded bg-zinc-700" />
        <div className="h-4 w-24 rounded bg-zinc-700/60" />
      </div>

      <div className="h-28 rounded-xl bg-zinc-800 border border-zinc-700/30" />

      <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-zinc-800/50">
        <div className="h-2 w-20 rounded bg-zinc-700/50" />
        <div className="flex justify-between items-end">
          <div className="h-5 w-16 rounded bg-zinc-700" />
          <div className="h-6 w-14 rounded bg-zinc-800 border border-zinc-700" />
        </div>
      </div>
    </div>
  );
}
