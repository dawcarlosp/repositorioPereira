import React from "react";
import AppLayout from "@layout/AppLayout";
import Main from "@layout/Main";
import TarjetaVendedor from "@components/vendedor/TarjetaVendedor";
import useVendedoresPendientes from "@hooks/useVendedoresPendientes";
import ModalConfirmacion from "@components/common/ModalConfirmacion";

export default function VendedoresPendientesPagina() {
  const { pendientes, loading, aprobar, eliminar } = useVendedoresPendientes();
  const [modal, setModal] = React.useState({ open: false, user: null, type: '' });

  return (
    <AppLayout>
      <Main>
        <h1 className="text-2xl font-black text-white mb-6">Pendientes de Aprobar</h1>
        <div className="bg-zinc-800/20 rounded-2xl p-4 border border-zinc-700">
          {loading ? <p className="text-center text-orange-500 py-20 animate-pulse">Cargando solicitudes...</p> : 
           pendientes.map(u => (
             <TarjetaVendedor 
                key={u.id} 
                usuario={u} 
                onAprobar={() => setModal({ open: true, user: u, type: 'aprobar' })} 
                onDenegar={() => setModal({ open: true, user: u, type: 'eliminar' })}
             />
           ))
          }
        </div>
      </Main>
      
      {modal.open && (
        <ModalConfirmacion 
          mensaje={`¿Confirmas ${modal.type} a ${modal.user.nombre}?`}
          onConfirmar={() => {
            modal.type === 'aprobar' ? aprobar(modal.user.id) : eliminar(modal.user.id);
            setModal({ open: false, user: null, type: '' });
          }}
          onCancelar={() => setModal({ open: false, user: null, type: '' })}
        />
      )}
    </AppLayout>
  );
}