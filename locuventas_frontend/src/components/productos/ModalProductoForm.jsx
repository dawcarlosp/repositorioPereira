import { useEffect, useState } from "react";
import DialogFormLayout from "@components/common/DialogFormLayout";
import InputFieldset from "@components/common/InputFieldset";
import SelectFieldset from "@components/common/SelectFieldset";
import UploadComponent from "@components/common/UploadComponent";

export default function ModalProductoForm({
  visible, onClose, onSubmit, editando,
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
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const sinPaises = paises.length === 0;

  return (
    <DialogFormLayout
      visible={visible}
      onClose={onClose}
      onSubmit={onSubmit}
      titulo={`${editando ? "Editar" : "Agregar"} Producto`}
      botonTexto={editando ? "Guardar Cambios" : "Registrar Producto"}
      botonDisabled={sinPaises}
    >
      <UploadComponent
        setFile={setFoto}
        file={foto instanceof File ? foto : null}
        fotoActualUrl={fotoUrlEdicion}
        disabled={sinPaises}
        className="flex-shrink-0"
      />

      {sinPaises && (
        <div className="bg-white text-red-700 text-xs font-medium py-1.5 px-3 rounded shadow text-center w-full max-w-xs flex-shrink-0">
          Para agregar productos primero debes cargar al menos un país.
        </div>
      )}

      <InputFieldset
        id="nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del producto"
        required
      />
      <InputFieldset
        id="precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        placeholder="Precio"
        type="number"
        required
      />
      <InputFieldset
        id="iva"
        value={iva}
        onChange={(e) => setIva(e.target.value)}
        placeholder="IVA (%)"
        type="number"
        required
      />

      {/* País — image pasa la bandera directamente al SelectFieldset */}
      <div className="w-full max-w-xs flex-shrink-0">
        <p className="text-white font-semibold text-xs mb-1">Selecciona un país *</p>
        <SelectFieldset
          id="pais"
          value={paisId}
          onChange={(e) => setPaisId(Number(e.target.value))}
          required
          disabled={sinPaises}
          options={paises.map((p) => ({
            value: p.id,
            label: p.nombre,
            image: p.enlaceFoto ?? null,   // 👈 bandera integrada en el select
          }))}
        />
      </div>

      {/* Categorías */}
      <div className="w-full max-w-xs flex-shrink-0">
        <p className="text-white font-semibold text-xs mb-1">Selecciona categorías *</p>
        {!isMobile ? (
          <SelectFieldset
            id="categorias"
            value={categoriaIds.map(String)}
            onChange={(e) =>
              setCategoriaIds(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
            required
            multiple
            disabled={sinPaises}
            options={categorias.map((c) => ({ value: c.id, label: c.nombre }))}
          />
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-black/10 rounded-lg custom-scrollbar">
            {categorias.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-1.5 text-gray-100 text-xs bg-black/20 rounded-lg px-2 py-1.5 cursor-pointer select-none active:bg-black/30"
              >
                <input
                  type="checkbox"
                  value={cat.id}
                  checked={categoriaIds.includes(String(cat.id)) || categoriaIds.includes(cat.id)}
                  onChange={(e) =>
                    e.target.checked
                      ? setCategoriaIds([...categoriaIds, String(cat.id)])
                      : setCategoriaIds(categoriaIds.filter((id) => id !== String(cat.id) && id !== cat.id))
                  }
                  className="accent-orange-400"
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