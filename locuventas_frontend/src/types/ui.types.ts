// src/types/ui.types.ts
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

export interface SelectOption {
  value: string | number;
  label: string;
  image?: string | null;
}

export interface MenuItem {
  label:      string;
  action?:    () => void;
  route?:     string;
  children?:  MenuItem[];
  panel?:     string;
  panelWidth?: string;
  panelProps?: Record<string, unknown>;
  danger?:    boolean;
}