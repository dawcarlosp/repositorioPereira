import type { Breakpoint } from "@domain/ui.types";

export const BREAKPOINTS: Record<string, Breakpoint> = {
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
};

type GroupName = "MOBILE" | "TABLET" | "DESKTOP" | "NOT_MOBILE" | "NOT_DESKTOP" | "SMALL_SCREENS";

export const BREAKPOINT_GROUPS: Record<GroupName, Breakpoint[]> = {
  MOBILE:       [BREAKPOINTS.XS, BREAKPOINTS.SM],
  TABLET:       [BREAKPOINTS.SM, BREAKPOINTS.MD],
  DESKTOP:      [BREAKPOINTS.LG, BREAKPOINTS.XL],
  NOT_MOBILE:   [BREAKPOINTS.MD, BREAKPOINTS.LG, BREAKPOINTS.XL],
  NOT_DESKTOP:  [BREAKPOINTS.XS, BREAKPOINTS.SM, BREAKPOINTS.MD],
  SMALL_SCREENS: [BREAKPOINTS.XS, BREAKPOINTS.SM, BREAKPOINTS.MD],
};

export const isBreakpoint = (breakpoint: string, group: GroupName): boolean => {
  return BREAKPOINT_GROUPS[group]?.includes(breakpoint as Breakpoint) ?? false;
};

export const isMobile    = (breakpoint: string): boolean => isBreakpoint(breakpoint, "MOBILE");
export const isTablet    = (breakpoint: string): boolean => isBreakpoint(breakpoint, "TABLET");
export const isDesktop   = (breakpoint: string): boolean => isBreakpoint(breakpoint, "DESKTOP");
export const isSmallScreen  = (breakpoint: string): boolean => isBreakpoint(breakpoint, "SMALL_SCREENS");
export const isNotMobile    = (breakpoint: string): boolean => isBreakpoint(breakpoint, "NOT_MOBILE");
export const isNotDesktop   = (breakpoint: string): boolean => isBreakpoint(breakpoint, "NOT_DESKTOP");
