// src/hooks/useBreakpoint.ts
import { useState, useEffect } from "react";
import type { Breakpoint } from "@domain/ui.types";

const SCREENS: Record<Breakpoint, number> = {
  xs:  0,
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
};

const calcBreakpoint = (): Breakpoint => {
  const width = window.innerWidth;
  if (width >= SCREENS.xl) return "xl";
  if (width >= SCREENS.lg) return "lg";
  if (width >= SCREENS.md) return "md";
  if (width >= SCREENS.sm) return "sm";
  return "xs";
};

export default function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(calcBreakpoint);

  useEffect(() => {
    const handleResize = (): void => setBreakpoint(calcBreakpoint());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}