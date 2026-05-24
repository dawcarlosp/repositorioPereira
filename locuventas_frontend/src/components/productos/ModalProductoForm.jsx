import { useEffect, useState } from "react";
import DialogFormLayout from "@components/common/DialogFormLayout"; 
import InputFieldset from "@components/common/InputFieldset";
import SelectFieldset from "@components/common/SelectFieldset";
import UploadComponent from "@components/common/UploadComponent";

export default function ModalProductoForm({
  visible,
  onClose,
  onSubmit,
  editando,
  nombre, setNombre,
  precio, setPrecio,
  iva, setIva,
  paisId, setPaisId,
  categoriaIds, setCategoriaIds,
  foto, setFoto,
  fotoUrlEdicion,
  paises,
  categorias,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <DialogFormLayout
      visible={visible}
      onClose={onClose}
      onSubmit={onSubmit}
      titulo={`${editando ? "Editar" : "Agregar"} Producto`}
      botonTexto={editando ? "Guardar Cambios" : "Registrar Producto"}
      botonDisabled={paises.length === 0}
    >
      {/* Todo lo que pongas aquí dentro se inyectará en {children} */}
      <UploadComponent
        setFile={setFoto}
        file={foto instanceof File ? foto : null}
        fotoActualUrl={fotoUrlEdicion}
        disabled={paises.length === 0}
        className="mb-4 flex-shrink-0"
      />

      {paises.length === 0 && (
        <div className="bg-white text-red-700 text-xs font-medium py-1.5 px-3 rounded shadow mb-2 text-center w-full">
          Para agregar productos primero debes cargar al menos un país.
        </div>
      )}

      <InputFieldset id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del producto" required />
      <InputFieldset id="precio" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio" type="number" required />
      <InputFieldset id="iva" value={iva} onChange={(e) => setIva(e.target.value)} placeholder="IVA" type="number" required />

      {/* Selector de País */}
      <div className="w-full text-left mb-1">
        <label htmlFor="pais" className="block text-white font-semibold text-xs mb-1">Selecciona un país *</label>
        <SelectFieldset
          id="pais"
          value={paisId}
          onChange={(e) => setPaisId(e.target.value)}
          required
          options={paises.map((p) => ({ value: p.id, label: p.nombre }))}
          disabled={paises.length === 0}
        />
        {paisId && paises.length > 0 && (
          <div className="flex items-center gap-2 mt-2 justify-center bg-black/10 rounded-lg p-1">
            {paises.find((p) => p.id === Number(paisId))?.enlaceFoto && (
              <img src={paises.find((p) => p.id === Number(paisId)).enlaceFoto} alt="Flag" className="w-7 h-5 rounded shadow" />
            )}
            <span className="text-xs text-gray-100 font-semibold">{paises.find((p) => p.id === Number(paisId))?.nombre}</span>
          </div>
        )}
      </div>

      {/* Selector de Categorías */}
      <div className="w-full text-left mb-1">
        <label htmlFor="categorias" className="block text-white font-semibold text-xs mb-1">Selecciona categorías *</label>
        {!isMobile ? (
          <SelectFieldset
            id="categorias"
            value={categoriaIds.map(String)}
            onChange={(e) => setCategoriaIds(Array.from(e.target.selectedOptions, (opt) => opt.value))}
            required
            options={categorias.map((c) => ({ value: c.id, label: c.nombre }))}
            multiple
            disabled={paises.length === 0}
          />
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-black/10 rounded-lg custom-scrollbar">
            {categorias.map((cat) => (
              <label key={cat.id} className="flex items-center text-gray-100 text-xs bg-black/10 rounded-lg px-2 py-1 cursor-pointer">
                <input
                  type="checkbox"
                  value={cat.id}
                  checked={categoriaIds.includes(String(cat.id)) || categoriaIds.includes(cat.id)}
                  onChange={(e) => e.target.checked 
                    ? setCategoriaIds([...categoriaIds, String(cat.id)]) 
                    : setCategoriaIds(categoriaIds.filter((id) => id !== String(cat.id) && id !== cat.id))
                  }
                  className="mr-1.5 accent-orange-400"
                />
                {cat.nombre}
              </label>
            ))}
          </div>
        )}
      </div>
    </DialogFormLayout>
  );
}