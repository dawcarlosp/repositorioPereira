package ies.juanbosoco.locuventas_backend.entities.catalogo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Builder
@Table(name = "categorias")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Debe proporcionar un nombre")
    @Column(unique = true)
    private String nombre;
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    @OneToMany(mappedBy = "categoria")
    private List<ProductoCategoria> productosCategorias = new ArrayList<>();
}
