import { useEffect, useState } from "react";
import Boton from "@components/common/Boton";
import BotonClaro from "@components/common/BotonClaro";
import InputFieldset from "@components/common/InputFieldset";
import SelectFieldset from "@components/common/SelectFieldset";
import UploadComponent from "@components/common/UploadComponent";
import BotonCerrar from "@components/common/BotonCerrar";

const API_URL = import.meta.env.VITE_API_URL;

export default function ModalProductoForm({
  visible,
  onClose,
  onSubmit,
  editando,
  nombre,
  setNombre,
  precio,
  setPrecio,
  iva,
  setIva,
  paisId,
  setPaisId,
  categoriaIds,
  setCategoriaIds,
  foto,
  setFoto,
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

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center px-2 sm:px-4" style={{ backdropFilter: "blur(5px)", background: "rgba(40,40,60,0.58)" }}>
      <div className="relative rounded-3xl shadow-2xl w-full max-w-md mx-auto flex flex-col border border-blue-400 bg-white/30 backdrop-blur-lg transition-all duration-500" style={{ boxShadow: "0 6px 40px #19192e33", maxHeight: "96vh" }}>
        <div className="flex items-center justify-between px-6 pt-6 pb-1 sticky top-0">
          <h2 className="text-xl font-bold text-white drop-shadow-md text-left">
            {editando ? "Editar" : "Agregar"} Producto
          </h2>
          <BotonCerrar onClick={onClose} className="absolute right-6 top-6" />
        </div>

        <div className="flex-1 px-6 py-2 overflow-y-auto" style={{ maxHeight: "calc(96vh - 120px)" }}>
          {paises.length === 0 && (
            <div className="bg-red-100 text-red-700 rounded px-2 py-2 mb-3 font-semibold text-center text-sm">
              Para agregar productos primero debes cargar al menos un país.
            </div>
          )}

          <div className="flex flex-col items-center justify-center mb-3">
            <UploadComponent
              setFile={setFoto}
              file={foto instanceof File ? foto : null}
              fotoActualUrl={fotoUrlEdicion}
              disabled={paises.length === 0}
              style={{ width: "90px", height: "90px", marginBottom: "0.4rem" }}
            />
          </div>

          <div className="flex flex-col gap-2 items-center">
            <InputFieldset
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              required
              className="text-base"
            />
            <InputFieldset
              id="precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Precio"
              type="number"
              required
              className="text-base"
            />
            <InputFieldset
              id="iva"
              value={iva}
              onChange={(e) => setIva(e.target.value)}
              placeholder="IVA"
              type="number"
              required
              className="text-base"
            />

            <div>
              <label className="block text-white font-semibold text-sm mb-1 text-left">
                Selecciona un país <span className="text-orange-400">*</span>
              </label>
              <SelectFieldset
                id="pais"
                value={paisId}
                onChange={(e) => setPaisId(e.target.value)}
                required
                options={paises.map((p) => ({ value: p.id, label: p.nombre }))}
                disabled={paises.length === 0}
                className="text-base"
              />
              {paisId && paises.length > 0 && (
                <div className="flex items-center gap-2 mt-2 justify-center">
                  {(() => {
                    const pais = paises.find((p) => p.id === Number(paisId));
                    return pais?.enlaceFoto ? (
                      <img
                        src={pais.enlaceFoto}
                        alt={pais.nombre}
                        className="w-7 h-5 rounded shadow"
                        style={{ border: "1px solid #eee" }}
                      />
                    ) : null;
                  })()}
                  <span className="text-base text-gray-100 font-semibold">
                    {paises.find((p) => p.id === Number(paisId))?.nombre || ""}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-white font-semibold text-sm mb-1 text-left">
                Selecciona categorías <span className="text-orange-400">*</span>
              </label>
              {!isMobile ? (
                <>
                  <SelectFieldset
                    id="categorias"
                    value={categoriaIds.map(String)}
                    onChange={(e) =>
                      setCategoriaIds(
                        Array.from(e.target.selectedOptions, (opt) => opt.value)
                      )
                    }
                    required
                    options={categorias.map((c) => ({
                      value: c.id,
                      label: c.nombre,
                    }))}
                    multiple
                    disabled={paises.length === 0}
                    className="text-base"
                  />
                  <div className="text-xs text-gray-200 mt-1">
                    Pulsa <span className="font-bold">Ctrl</span> (o <span className="font-bold">Cmd</span> en Mac) para seleccionar varias categorías
                  </div>
                </>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categorias.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center text-gray-100 text-sm bg-black/10 rounded-lg px-2 py-1 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={cat.id}
                        checked={
                          categoriaIds.includes(String(cat.id)) || categoriaIds.includes(cat.id)
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCategoriaIds([...categoriaIds, String(cat.id)]);
                          } else {
                            setCategoriaIds(
                              categoriaIds.filter(
                                (id) => id !== String(cat.id) && id !== cat.id
                              )
                            );
                          }
                        }}
                        className="mr-2 accent-orange-400"
                      />
                      {cat.nombre}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-3 mb-4 px-6 sticky bottom-0">
          <Boton
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-lg text-base"
            disabled={paises.length === 0}
            onClick={onSubmit}
          >
            Guardar
          </Boton>
          <BotonClaro
            type="button"
            onClick={onClose}
            className="font-bold px-6 py-2 rounded-lg text-base"
          >
            Cancelar
          </BotonClaro>
        </div>
      </div>
    </div>
  );
}
