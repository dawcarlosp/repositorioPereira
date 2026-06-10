// src/hooks/useResponsiveLayout.js
import useBreakpoint from "@hooks/useBreakpoint";
import { useMemo } from "react";

export default function useResponsiveLayout() {
  const breakpoint = useBreakpoint();
  return useMemo(() => ({
    isSmall:  ["xs", "sm"].includes(breakpoint),
    isMedium: ["md"].includes(breakpoint),
    isLarge:  ["lg", "xl", "2xl"].includes(breakpoint),
    breakpoint,
  }), [breakpoint]);
}