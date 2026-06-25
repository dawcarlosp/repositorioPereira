// src/hooks/useResponsiveLayout.ts
import { useMemo } from "react";
import useBreakpoint from "@hooks/useBreakpoint";
import type { Breakpoint } from "@domain/ui.types";

interface ResponsiveLayout {
  isSmall:    boolean;
  isMedium:   boolean;
  isLarge:    boolean;
  breakpoint: Breakpoint;
}

export default function useResponsiveLayout(): ResponsiveLayout {
  const breakpoint = useBreakpoint();

  return useMemo(() => ({
    isSmall:  ["xs", "sm"].includes(breakpoint),
    isMedium: ["md"].includes(breakpoint),
    isLarge:  ["lg", "xl"].includes(breakpoint),
    breakpoint,
  }), [breakpoint]);
}