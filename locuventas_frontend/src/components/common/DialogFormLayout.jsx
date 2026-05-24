import { useEffect, useRef, useState } from "react";
import Boton from "@components/common/Boton";
import BotonCerrar from "@components/common/BotonCerrar";

export default function DialogFormLayout({
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
  
  // Control fino de renderizado para evitar cortes bruscos en la animación
  const [render, setRender] = useState(visible);
  const [animState, setAnimState] = useState("closed");

  // Sincroniza estados de apertura y cierre con delay para la transición
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

  // Manejo directo del elemento nativo HTML5 <dialog>
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (render && !dialog.open) {
      dialog.showModal();
    }
    if (!render && dialog.open) {
      dialog.close();
    }
  }, [render]);

  const handleClose = () => {
    setAnimState("closing");
    setTimeout(() => onClose(), 280);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    handleClose();
  };

  // Barra de scroll personalizada temporal
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsScrolling(false), 800);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [render]);

  if (!render) return null;

  // 🛠️ Animación CSS: Ahora se aplica de forma global al marco exterior del modal
  const animationClass = animState === "open"
    ? "opacity-100 scale-100"
    : "opacity-0 scale-95 pointer-events-none";

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      style={{ 
        backdropFilter: "blur(5px)", 
        background: "rgba(40,40,60,0.58)",
        border: "0",
        padding: "0"
      }}
      // 🛠️ MAQUETACIÓN HÍBRIDA PERFECTA:
      // - fixed inset-0 m-auto: Lo clava geométricamente en el centro del PC sin importar la resolución.
      // - h-auto max-h-[90dvh]: En móvil se adapta a los inputs, pero si crece se detiene de forma segura en el 90% del alto dinámico de la pantalla.
      // - sm:h-[85vh]: En computadoras de escritorio se expande con elegancia para que los inputs no se amontonen.
      className={`fixed inset-0 m-auto flex flex-col items-center rounded-xl shadow-2xl bg-white/30 backdrop-blur-lg transform transition-all duration-300 ease-out h-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-[400px] overflow-hidden sm:h-[85vh] backdrop:backdrop-blur-[5px] backdrop:bg-[rgba(40,40,60,0.58)] ${animationClass}`}
    >
      <BotonCerrar type="button" onClick={handleClose} />

      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit(e); }}
        className="flex flex-col items-center pt-8 pb-6 px-6 sm:pt-10 sm:pb-8 sm:px-8 w-full h-full min-h-0 flex-1 overflow-hidden"
        autoComplete="off"
      >
        <h2 className="text-xl font-bold text-white drop-shadow-md mb-4 sm:mb-5 flex-shrink-0 text-center w-full">
          {titulo}
        </h2>

        {/* 🛠️ CONTENEDOR SEGURO DE SCROLL: 
            Usa overscroll-contain para que el scroll del móvil no mueva el fondo de la página web */}
        <div 
          ref={scrollContainerRef}
          className={`custom-scrollbar ${isScrolling ? "scrolling" : ""} flex-1 overflow-y-auto overflow-x-hidden overscroll-contain w-full flex flex-col items-center gap-2 pr-1 pb-2 min-h-0`}
        >
          {children}
        </div>

        {/* Forzamos que el botón del formulario comparta la misma anchura que tus inputs (max-w-xs) */}
        <div className="w-full max-w-xs flex-shrink-0 mt-3 sm:mt-4">
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