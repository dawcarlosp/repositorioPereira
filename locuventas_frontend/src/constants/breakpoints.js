/**
 * Valores de breakpoints responsive
 * Centraliza constantes de tamaños de pantalla
 */

export const BREAKPOINTS = {
  XS: "xs",      // < 640px (mobile)
  SM: "sm",      // 640px - 768px (tablet pequeño)
  MD: "md",      // 768px - 1024px (tablet)
  LG: "lg",      // 1024px - 1280px (laptop)
  XL: "xl",      // 1280px - 1536px (laptop grande)
  "2XL": "2xl",  // >= 1536px (desktop grande)
};

/**
 * Grupos de breakpoints
 */
export const BREAKPOINT_GROUPS = {
  MOBILE: [BREAKPOINTS.XS, BREAKPOINTS.SM],
  TABLET: [BREAKPOINTS.SM, BREAKPOINTS.MD],
  DESKTOP: [BREAKPOINTS.LG, BREAKPOINTS.XL, BREAKPOINTS["2XL"]],
  NOT_MOBILE: [BREAKPOINTS.MD, BREAKPOINTS.LG, BREAKPOINTS.XL, BREAKPOINTS["2XL"]],
  NOT_DESKTOP: [BREAKPOINTS.XS, BREAKPOINTS.SM, BREAKPOINTS.MD],
  SMALL_SCREENS: [BREAKPOINTS.XS, BREAKPOINTS.SM, BREAKPOINTS.MD],
};

/**
 * Predicados para breakpoints comunes
 */
export const isBreakpoint = (breakpoint, group) => {
  return BREAKPOINT_GROUPS[group]?.includes(breakpoint) ?? false;
};

export const isMobile = (breakpoint) => isBreakpoint(breakpoint, "MOBILE");
export const isTablet = (breakpoint) => isBreakpoint(breakpoint, "TABLET");
export const isDesktop = (breakpoint) => isBreakpoint(breakpoint, "DESKTOP");
export const isSmallScreen = (breakpoint) => isBreakpoint(breakpoint, "SMALL_SCREENS");
export const isNotMobile = (breakpoint) => isBreakpoint(breakpoint, "NOT_MOBILE");
export const isNotDesktop = (breakpoint) => isBreakpoint(breakpoint, "NOT_DESKTOP");
