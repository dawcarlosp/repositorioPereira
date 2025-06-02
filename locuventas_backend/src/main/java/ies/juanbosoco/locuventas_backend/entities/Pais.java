package ies.juanbosoco.locuventas_backend.entities;

import jakarta.persistence.*;
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
    @Table(name = "paises")
    public class Pais {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String nombre;

        private String codigo;

        private String enlaceFoto;

        @OneToMany(mappedBy = "pais")
        private List<Producto> productos;
    }
