package ies.juanbosoco.locuventas_backend.entities;

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
    private Producto producto;

    @ManyToOne
    @MapsId("categoriaId")
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    // Ejemplo de metadatos adicionales
    //private Integer prioridad;
    //private LocalDate fechaAsignacion;
}
