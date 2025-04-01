package ies.juanbosoco.locuventas_backend.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Builder
@Table(name = "ventas")
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double total;
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name = "vendedor_id", nullable = false)
    private Vendedor vendedor;

    private Double montoPagado = 0.0;
    @Enumerated(EnumType.STRING)
    private EstadoPago estadoPago = EstadoPago.PENDIENTE;
    public enum EstadoPago{
        PENDIENTE ,PARCIAL, PAGADO
    }

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL)
    private List<VentaProducto> productos = new ArrayList<>();

    public void calcularTotal() {
        this.total = productos.stream()
                .mapToDouble(VentaProducto::getSubtotal)
                .sum();
    }
}
