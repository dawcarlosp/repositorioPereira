// src/domain/ui.types.ts
import type { MouseEvent } from "react";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

export interface SelectOption {
  value: number;
  label: string;
  image?: string | null;
}

export interface MenuItem {
  label:      string;
  action?:    (e?: MouseEvent) => void;
  route?:     string;
  children?:  MenuItem[];
  panel?:     string;
  panelWidth?: string;
  panelProps?: Record<string, unknown>;
  danger?:    boolean;
}