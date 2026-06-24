// src/types/api.types.ts
export interface ApiResponse<T> {
  message: string;
  status:  number;
  data:    T;
}

export interface PageDTO<T> {
  content:       T[];
  number:        number;
  totalPages:    number;
  totalElements: number;
}