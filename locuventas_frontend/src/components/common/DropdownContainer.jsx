import React, {
  useLayoutEffect,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";

export default function DropdownContainer({
  children,
  isOpen,
  side = "top",
  triggerRef,
  arrowOffset: manualOffset = null,
  className = "",
  width = "w-64",
}) {
  const [arrowPos, setArrowPos] = useState(() => manualOffset ?? null);
  const containerRef = useRef(null);
  const rafRef = useRef(null);

  const calcOffset = useCallback(() => {
  console.log("calcOffset", {
    manualOffset,
    triggerCurrent: triggerRef?.current,
    containerCurrent: containerRef.current,
  });
    if (!triggerRef?.current || !containerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const raw =
      side === "left" || side === "right"
        ? triggerRect.top + triggerRect.height / 2 - containerRect.top
        : triggerRect.left + triggerRect.width / 2 - containerRect.left;

    const max =
      side === "left" || side === "right"
        ? containerRect.height - 12
        : containerRect.width - 12;

    setArrowPos(`${Math.min(Math.max(raw, 12), max)}px`);
  }, [side, triggerRef, manualOffset]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    rafRef.current = requestAnimationFrame(calcOffset);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isOpen, calcOffset]);

  useEffect(() => {
    if (!isOpen) return;
    const ro = new ResizeObserver(calcOffset);
    if (containerRef.current) ro.observe(containerRef.current);
    if (triggerRef?.current) ro.observe(triggerRef.current);
    window.addEventListener("scroll", calcOffset, { passive: true, capture: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", calcOffset, { capture: true });
    };
  }, [isOpen, calcOffset]);

  if (!isOpen) return null;

  // Flecha: posición y bordes según el lado
  // El cuadrado rotado 45° forma el diamante.
  // Los bordes visibles son los que quedan "hacia fuera" del contenedor.
  const arrowStyles = {
    top: {
      // Flecha apunta arriba → sale por el borde superior
      wrapperStyle: { top: 0, left: arrowPos, transform: "translateX(-50%)" },
      diamondStyle: { top: "-7px" },
      borders: "border-t border-l border-purple-500",
    },
    bottom: {
      // Flecha apunta abajo → sale por el borde inferior
      wrapperStyle: { bottom: 0, left: arrowPos, transform: "translateX(-50%)" },
      diamondStyle: { bottom: "-7px" },
      borders: "border-b border-r border-purple-500",
    },
    left: {
      // Flecha apunta izquierda → sale por el borde izquierdo
      wrapperStyle: { left: 0, top: arrowPos, transform: "translateY(-50%)" },
      diamondStyle: { left: "-7px" },
      borders: "border-l border-b border-purple-500",
    },
    right: {
      // Flecha apunta derecha → sale por el borde derecho
      wrapperStyle: { right: 0, top: arrowPos, transform: "translateY(-50%)" },
      diamondStyle: { right: "-7px" },
      borders: "border-r border-t border-purple-500",
    },
  };

  const { wrapperStyle, diamondStyle, borders } = arrowStyles[side];

  return (
    // Wrapper: no tiene borde ni bg, solo establece el contexto de posicionamiento
    // z-50 aquí garantiza que TODO (flecha incluida) queda sobre el trigger
    <div
      ref={containerRef}
      className={`${width} ${className}`}
      style={{ overflow: "visible" }}
    >
      {/* Flecha: vive en el wrapper pero FUERA del div con borde,
          así rounded-xl nunca la recorta y z-50 del wrapper la protege */}
      {arrowPos !== null && (
        <div
          className="absolute z-[52]"
          style={wrapperStyle}
        >
          <div
            className={`w-3.5 h-3.5 bg-zinc-900 rotate-45 border-purple-500 absolute ${borders}`}
            style={diamondStyle}
          />
        </div>
      )}

      {/* Contenedor visual: borde, fondo, sombra, contenido */}
      <div className="relative z-[51] w-full h-full bg-zinc-900 border border-purple-500 shadow-2xl rounded-xl">
        <div className="relative z-10 p-2 h-full">{children}</div>
      </div>
    </div>
  );
}