// src/types/auth.types.ts
export type Role = "ROLE_ADMIN" | "ROLE_VENDEDOR";

export interface Auth {
  token:  string;
  nombre: string;
  email:  string;
  foto:   string | null;
  roles:  Role[];
  id:     number;
}