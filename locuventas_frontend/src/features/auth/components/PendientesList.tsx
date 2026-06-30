import { useState } from "react";
import type { ConfirmacionGlobal } from "@/features/auth/domain/auth.types";
import type { UsuarioPendiente } from "@/features/auth/domain/vendedor.types";
import useVendedoresPendientes from "@hooks/useVendedoresPendientes";
import TarjetaVendedor from "@/features/auth/components/TarjetaVendedor";
import Paginacion from "@components/common/Paginacion";
import BuscadorInput from "@components/common/BuscadorInput";
import SkeletonTarjetaVendedor from "@/features/auth/components/SkeletonTarjetaVendedor";

const SKELETON_COUNT = 3;

interface Props {
  onConfirmacion: (c: ConfirmacionGlobal) => void;
  page?:          number;
  size?:          number;
  onPageChange?:  (n: number) => void;
  onSizeChange?:  (n: number) => void;
}

export default function PendientesList({
  onConfirmacion,
  page: externalPage,
  size: externalSize,
  onPageChange,
  onSizeChange,
}: Props) {
  const [internalPage, setInternalPage] = useState(0);
  const [internalSize, setInternalSize] = useState(3);
  const [search, setSearch]             = useState("");

  const page = externalPage ?? internalPage;
  const size = externalSize ?? internalSize;

  const { pendientes, loading, totalPages, aprobar, eliminar } =
    useVendedoresPendientes({ page, size, search });

  const handlePageChange = onPageChange ?? setInternalPage;
  const handleSizeChange = onSizeChange ?? ((s: number) => { setInternalSize(s); setInternalPage(0); });

  const handleSearch = (v: string) => {
    setSearch(v);
    handlePageChange(0);
  };

  const handleAction = (usuario: UsuarioPendiente, type: "aprobar" | "eliminar") => {
    onConfirmacion({
      mensaje: type === "aprobar"
        ? `¿Aprobar a ${usuario.nombre}?`
        : `¿Eliminar a ${usuario.nombre}?`,
      confirmText: type === "aprobar" ? "Aprobar" : "Eliminar",
      onConfirmar: () => type === "aprobar" ? aprobar(usuario.id) : eliminar(usuario.id),
    });
  };

  return (
    <div className="flex flex-col h-full">
      <header className="px-2 pb-3 border-b border-zinc-800">
        <h4 className="text-white font-bold text-[10px] uppercase tracking-widest opacity-70 mb-2">
          Panel de Aprobación
        </h4>
        <BuscadorInput
          value={search}
          onChange={handleSearch}
          placeholder="Buscar por nombre o email..."
        />
      </header>

      <div className="mt-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
        {loading ? (
          <ul className="space-y-3">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <SkeletonTarjetaVendedor key={i} />
            ))}
          </ul>
        ) : pendientes.length === 0 ? (
          <p className="text-zinc-500 text-center py-10 italic text-xs">
            {search ? `Sin resultados para "${search}"` : "Sin registros"}
          </p>
        ) : (
          <ul className="space-y-3">
            {pendientes.map(u => (
              <TarjetaVendedor
                key={u.id}
                usuario={u}
                onAprobar={(u) => handleAction(u, "aprobar")}
                onDenegar={(u) => handleAction(u, "eliminar")}
              />
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-2 border-t border-zinc-800 pt-2">
          <Paginacion
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            size={size}
            onSizeChange={handleSizeChange}
          />
        </div>
      )}
    </div>
  );
}
