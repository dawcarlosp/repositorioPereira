// src/types/producto.types.ts
export interface Producto {
  id:          number;
  nombre:      string;
  precio:      number;
  iva:         number;
  foto:        string | null;
  paisId:      number;
  paisNombre:  string;
  paisFoto:    string | null;
  categorias:  string[];
}

export interface ProductoDTO {
  nombre:      string;
  precio:      number;
  iva:         number;
  paisId:      number;
  categoriaIds: number[];
}