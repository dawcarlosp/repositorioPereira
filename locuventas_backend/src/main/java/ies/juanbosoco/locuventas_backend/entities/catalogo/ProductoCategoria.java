package ies.juanbosoco.locuventas_backend.entities.catalogo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Builder
@Table(name = "producto_categoria")
public class ProductoCategoria {
    @EmbeddedId
    private ProductoCategoriaId id = new ProductoCategoriaId();

    @ManyToOne
    @MapsId("productoId")
    @JoinColumn(name = "producto_id")
    @JsonIgnoreProperties("categorias")

    private Producto producto;

    @ManyToOne
    @MapsId("categoriaId")
    @JoinColumn(name = "categoria_id")
    @JsonIgnoreProperties("productosCategorias")
    private Categoria categoria;

    // Ejemplo de metadatos adicionales
    //private Integer prioridad;
    //private LocalDate fechaAsignacion;

    public ProductoCategoria(Producto producto, Categoria categoria) {
        this.producto = producto;
        this.categoria = categoria;
        // IMPORTANTE: Sincronizar el ID embebido con los objetos
        this.id = new ProductoCategoriaId(producto.getId(), categoria.getId());
    }
}
