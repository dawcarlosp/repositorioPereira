// src/components/products/ModalProductoForm.tsx
import FormDialog from "@components/common/FormDialog";
import InputFieldset from "@components/common/InputFieldset";
import SelectFieldset from "@components/common/SelectFieldset";
import UploadComponent from "@components/common/UploadComponent";
import useBreakpoint from "@hooks/useBreakpoint";
import { isBreakpoint } from "@constants/breakpoints";
import type { SelectOption } from "@/types/producto.types";

interface Props {
  visible:          boolean;
  onClose:          () => void;
  onSubmit:         (e: React.FormEvent) => void;
  editando:         any | null;
  nombre:           string;
  setNombre:        (v: string) => void;
  precio:           string;
  setPrecio:        (v: string) => void;
  iva:              string;
  setIva:           (v: string) => void;
  paisId:           number | "";
  setPaisId:        (v: number | "") => void;
  categoriaIds:     number[];
  setCategoriaIds:  (v: number[]) => void;
  foto:             File | null;
  setFoto:          (v: File | null) => void;
  fotoUrlEdicion:   string | null;
  paises:           SelectOption[];
  categorias:       SelectOption[];
}

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
}: Props) {
  const bp       = useBreakpoint();
  const isMobile = isBreakpoint(bp, "MOBILE");
  const sinPaises = paises.length === 0;

  // Siempre number — sin conversiones de tipo
  const toggleCategoria = (id: number, checked: boolean) => {
    setCategoriaIds(
      checked
        ? [...categoriaIds, id]
        : categoriaIds.filter((c) => c !== id)
    );
  };

  return (
    <FormDialog
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

      {/* País */}
      <div className="w-full max-w-xs flex-shrink-0">
        <p className="text-white font-semibold text-xs mb-1">Selecciona un país *</p>
        <SelectFieldset
          id="pais"
          value={paisId}
          onChange={(e) => setPaisId(Number(e.target.value))}
          required
          disabled={sinPaises}
          options={paises}
        />
      </div>

      {/* Categorías */}
      <div className="w-full max-w-xs flex-shrink-0">
        <p className="text-white font-semibold text-xs mb-1">Selecciona categorías *</p>

        {!isMobile ? (
          <SelectFieldset
            id="categorias"
            value={categoriaIds}
            onChange={(e) =>
              setCategoriaIds(
                Array.from(e.target.selectedOptions, (opt) => Number(opt.value))
              )
            }
            required
            multiple
            disabled={sinPaises}
            options={categorias}
          />
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-black/10 rounded-lg custom-scrollbar">
            {categorias.map((cat) => (
              <label
                key={cat.value}
                className="flex items-center gap-1.5 text-gray-100 text-xs bg-black/20 rounded-lg px-2 py-1.5 cursor-pointer select-none active:bg-black/30"
              >
                <input
                  type="checkbox"
                  value={cat.value}
                  checked={categoriaIds.includes(cat.value)}  // ← ambos son number
                  onChange={(e) => toggleCategoria(cat.value, e.target.checked)}
                  className="accent-orange-400"
                />
                {cat.label}
              </label>
            ))}
          </div>
        )}
      </div>
    </FormDialog>
  );
}