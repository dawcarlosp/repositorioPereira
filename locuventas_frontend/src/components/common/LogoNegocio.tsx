import { Link } from "react-router-dom";

export default function LogoNegocio() {
  return (
    <div className="mt-auto group">
      <Link
        to="/dashboard"
        className="
          text-2xl font-extrabold tracking-tight
          px-6 py-3 rounded-2xl inline-block
          transition-all duration-300 ease-in-out
          bg-zinc-900 text-white
          border-2 border-purple-500/30
          shadow-lg shadow-purple-500/20
          group-hover:border-purple-500/60
          group-hover:shadow-purple-500/40
          hover:scale-105
          active:scale-95
        "
      >
        <span className="text-zinc-100 drop-shadow-md">Locu</span>
        <span className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
          Ventas
        </span>
      </Link>
    </div>
  );
}
