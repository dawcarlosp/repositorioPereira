import { useEffect, useRef, useState } from "react";
import Boton from "@buttons/Boton";
import BotonCerrar from "@buttons/BotonCerrar";

export default function FormDialog({
  visible,
  onClose,
  onSubmit,
  titulo,
  botonTexto,
  botonDisabled = false,
  children,
}) {
  const dialogRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [render, setRender] = useState(visible);
  const [animState, setAnimState] = useState("closed");

  useEffect(() => {
    if (visible) {
      setRender(true);
      requestAnimationFrame(() => setAnimState("open"));
    } else {
      setAnimState("closing");
      const t = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (render && !dialog.open) dialog.showModal();
    if (!render && dialog.open) dialog.close();
  }, [render]);

  const handleClose = () => {
    setAnimState("closing");
    setTimeout(() => onClose(), 280);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    handleClose();
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    let timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsScrolling(false), 800);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [render]);

  if (!render) return null;

  const animationClass =
    animState === "open"
      ? "opacity-100 scale-100"
      : "opacity-0 scale-95 pointer-events-none";

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      style={{
        border: "0",
        padding: "0",
        background: "transparent",
        // El backdrop lo maneja Tailwind backdrop:
      }}
      className={`
        fixed inset-0 m-auto
        w-[calc(100%-2rem)] max-w-[420px]
        max-h-[92dvh]
        rounded-2xl shadow-2xl overflow-hidden
        bg-[rgba(28,24,48,0.82)] backdrop-blur-xl
        flex flex-col
        transform transition-all duration-300 ease-out
        backdrop:backdrop-blur-[6px] backdrop:bg-[rgba(30,25,55,0.55)]
        ${animationClass}
      `}
    >
      {/* Cabecera fija: nunca se comprime ni desaparece */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3 sm:px-7 sm:pt-6">
        <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-md leading-tight">
          {titulo}
        </h2>
        <BotonCerrar type="button" onClick={handleClose} />
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit(e); }}
        autoComplete="off"
        className="flex flex-col min-h-0 flex-1 overflow-hidden px-5 pb-5 sm:px-7 sm:pb-6"
      >
        {/*
          ZONA DE SCROLL:
          - overflow-y-auto: scroll solo cuando el contenido supera el espacio disponible
          - flex-1 min-h-0: ocupa el espacio sobrante entre cabecera y botón, sin comprimir nada
          - Los hijos NO son flex — son block, así cada uno toma su altura natural
        */}
        <div
          ref={scrollContainerRef}
          className={`
            custom-scrollbar ${isScrolling ? "scrolling" : ""}
            flex-1 min-h-0
            overflow-y-auto overflow-x-hidden
            overscroll-contain
            flex flex-col items-center
            gap-3
            py-2 pr-0.5
          `}
        >
          {children}
        </div>

        {/* Botón siempre visible en la parte inferior */}
        <div className="flex-shrink-0 w-full max-w-xs mx-auto mt-4">
          <Boton
            type="submit"
            disabled={botonDisabled}
            className="w-full"
          >
            {botonTexto}
          </Boton>
        </div>
      </form>
    </dialog>
  );
}