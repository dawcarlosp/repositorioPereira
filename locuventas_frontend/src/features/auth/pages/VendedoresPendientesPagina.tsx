import { useState } from "react";
import type { ConfirmacionGlobal } from "@/features/auth/domain/auth.types";
import AppLayout from "@layout/AppLayout";
import Main from "@layout/Main";
import ModalConfirmacion from "@components/common/ModalConfirmacion";
import PendientesList from "@features/auth/components/PendientesList";

export default function VendedoresPendientesPagina() {
  const [page, setPage]             = useState(0);
  const [size, setSize]             = useState(1);
  const [confirmacion, setConfirmacion] = useState<ConfirmacionGlobal | null>(null);

  return (
    <AppLayout>
      <Main>
        <h1 className="text-2xl font-black text-white mb-6">
          Pendientes de Aprobar
        </h1>
        <div className="bg-zinc-800/20 rounded-2xl p-4 border border-zinc-700">
          <PendientesList
            onConfirmacion={setConfirmacion}
            page={page}
            size={size}
            onPageChange={setPage}
            onSizeChange={(s) => { setSize(s); setPage(0); }}
          />
        </div>
      </Main>

      {confirmacion && (
        <ModalConfirmacion
          mensaje={confirmacion.mensaje}
          confirmText={confirmacion.confirmText}
          onConfirmar={() => { confirmacion.onConfirmar(); setConfirmacion(null); }}
          onCancelar={() => setConfirmacion(null)}
        />
      )}
    </AppLayout>
  );
}
