package ies.juanbosoco.locuventas_backend.entities.catalogo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

    @NoArgsConstructor
    @AllArgsConstructor
    @Entity
    @Getter
    @Setter
    @Builder
    @Table(name = "paises")
    public class Pais {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String nombre;

        private String codigo;

        private String enlaceFoto;

        @OneToMany(mappedBy = "pais")
        @JsonIgnore
        private List<Producto> productos;
    }
