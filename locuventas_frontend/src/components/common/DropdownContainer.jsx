// src/components/common/DropdownContainer.jsx
import React, {
  useLayoutEffect,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";

const EDGE_GAP = 24;

export default function DropdownContainer({
  children,
  isOpen,
  side = "top",
  triggerRef,
  arrowOffset: manualOffset = null,
  className = "",
  width = "w-64",
}) {
  const [arrowPos, setArrowPos]         = useState(null);
  const [resolvedSide, setResolvedSide] = useState(side);
  const containerRef = useRef(null);
  const rafRef       = useRef(null);

  const calcLayout = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let actual = side;
    if      (side === "right"  && containerRect.left   < EDGE_GAP)      actual = "left";
    else if (side === "left"   && containerRect.right  > vw - EDGE_GAP) actual = "right";
    else if (side === "top"    && containerRect.top    < EDGE_GAP)       actual = "bottom";
    else if (side === "bottom" && containerRect.bottom > vh - EDGE_GAP)  actual = "top";
    setResolvedSide(actual);

    if (manualOffset !== null) {
      setArrowPos(manualOffset);
      return;
    }
    if (!triggerRef?.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const raw = (actual === "left" || actual === "right")
      ? triggerRect.top  + triggerRect.height / 2 - containerRect.top
      : triggerRect.left + triggerRect.width  / 2 - containerRect.left;
    const max = (actual === "left" || actual === "right")
      ? containerRect.height - 12
      : containerRect.width  - 12;

    setArrowPos(`${Math.min(Math.max(raw, 12), max)}px`);
  }, [side, triggerRef, manualOffset]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    // Doble rAF: primer frame monta, segundo frame el layout está estabilizado
    rafRef.current = requestAnimationFrame(() => {
      calcLayout();
      rafRef.current = requestAnimationFrame(calcLayout);
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [isOpen, calcLayout]);

  useEffect(() => {
    if (!isOpen) return;
    const ro = new ResizeObserver(calcLayout);
    if (containerRef.current) ro.observe(containerRef.current);
    if (triggerRef?.current)  ro.observe(triggerRef.current);
    window.addEventListener("scroll", calcLayout, { passive: true, capture: true });
    window.addEventListener("resize", calcLayout, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", calcLayout, { capture: true });
      window.removeEventListener("resize", calcLayout);
    };
  }, [isOpen, calcLayout]);

  if (!isOpen) return null;

  const arrowConfigs = {
    top:    { wrapperStyle: { top:    0, left:  arrowPos, transform: "translateX(-50%)" }, diamondStyle: { top:    "-7px" }, borders: "border-t border-l border-purple-500" },
    bottom: { wrapperStyle: { bottom: 0, left:  arrowPos, transform: "translateX(-50%)" }, diamondStyle: { bottom: "-7px" }, borders: "border-b border-r border-purple-500" },
    left:   { wrapperStyle: { left:   0, top:   arrowPos, transform: "translateY(-50%)" }, diamondStyle: { left:   "-7px" }, borders: "border-l border-b border-purple-500" },
    right:  { wrapperStyle: { right:  0, top:   arrowPos, transform: "translateY(-50%)" }, diamondStyle: { right:  "-7px" }, borders: "border-r border-t border-purple-500" },
  };

  const { wrapperStyle, diamondStyle, borders } = arrowConfigs[resolvedSide];

  return (
    <div
      ref={containerRef}
      className={`absolute ${width} ${className}`}
      style={{ overflow: "visible" }}
    >
      {arrowPos !== null && (
        <div className="absolute z-[52]" style={wrapperStyle}>
          <div
            className={`w-3.5 h-3.5 bg-zinc-900 rotate-45 border-purple-500 absolute ${borders}`}
            style={diamondStyle}
          />
        </div>
      )}
      <div className="relative z-[51] w-full h-full bg-zinc-900 border border-purple-500 shadow-2xl rounded-xl">
        <div className="relative z-10 p-2 h-full">{children}</div>
      </div>
    </div>
  );
}