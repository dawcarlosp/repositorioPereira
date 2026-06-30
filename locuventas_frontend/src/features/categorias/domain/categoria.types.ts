export interface Categoria {
  id: number;
  nombre: string;
}

export interface CategoriaCreateDTO {
  nombre: string;
}

export interface CategoriaConProductos extends Categoria {
  productCount: number;
}
