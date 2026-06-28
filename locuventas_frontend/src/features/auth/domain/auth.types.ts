// src/features/auth/domain/auth.types.ts
export type Role = "ROLE_ADMIN" | "ROLE_VENDEDOR";

export interface Auth {
  token:  string | null;
  nombre: string | null;
  foto:   string | null;
  email:  string | null;
  roles:  Role[];
}

export interface ConfirmacionGlobal {
  mensaje:     string;
  confirmText: string;
  onConfirmar: () => void | Promise<void>;
}
