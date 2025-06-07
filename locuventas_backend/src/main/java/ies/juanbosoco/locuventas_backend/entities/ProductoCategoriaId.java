package ies.juanbosoco.locuventas_backend.entities;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Embeddable
public class ProductoCategoriaId  implements Serializable {
    private Long productoId;
    private Long categoriaId;
    // equals() y hashCode() obligatorios
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProductoCategoriaId)) return false;
        ProductoCategoriaId that = (ProductoCategoriaId) o;
        return Objects.equals(productoId, that.productoId) &&
                Objects.equals(categoriaId, that.categoriaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productoId, categoriaId);
    }
}
