import type { Venta } from "../domain/venta.types";
import TablaVentas from "./TablaVentas";
import VentaCard from "./VentaCard";
import SkeletonVentaCard from "./SkeletonVentaCard";
import Paginacion from "@components/common/Paginacion";
import useBreakpoint from "@hooks/useBreakpoint";
import { isBreakpoint } from "@constants/breakpoints";

interface Props {
  ventas:       Venta[];
  loading:      boolean;
  onVerDetalle: (v: Venta) => void;
  onCancelar:   (v: Venta) => void;
  onCobrar:     (v: Venta) => void;
  page:         number;
  totalPages:   number;
  onPageChange: (n: number) => void;
  size:         number;
  onSizeChange: (n: number) => void;
}

export default function ContenedorVentas({
  ventas,
  loading,
  onVerDetalle,
  onCancelar,
  onCobrar,
  page,
  totalPages,
  onPageChange,
  size,
  onSizeChange,
}: Props) {
  const bp = useBreakpoint();
  const isMobile = isBreakpoint(bp, "MOBILE");

  const paginacion = !loading && totalPages > 1 && (
    <Paginacion
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      size={size}
      onSizeChange={onSizeChange}
    />
  );

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3">
        {loading
          ? Array.from({ length: size ?? 5 }).map((_, i) => (
              <SkeletonVentaCard key={i} />
            ))
          : ventas.length === 0
            ? (
              <div className="py-12 text-center text-zinc-400 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                No se encontraron ventas registradas.
              </div>
            )
            : ventas.map((v) => (
              <VentaCard
                key={v.id}
                venta={v}
                onDetalle={onVerDetalle}
                onCancelar={onCancelar}
                onCobrarResto={onCobrar}
              />
            ))
        }
        {paginacion}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <TablaVentas
        ventas={ventas}
        loading={loading}
        onVerDetalle={onVerDetalle}
        onCancelarVenta={onCancelar}
        onCobrarResto={onCobrar}
        size={size}
      />
      {paginacion}
    </div>
  );
}
