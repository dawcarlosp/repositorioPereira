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

    private BigDecimal total;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL)
    private List<Pago> pagos = new ArrayList<>();


    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "vendedor_id", nullable = false)
    private Vendedor vendedor;

    private BigDecimal montoPagado = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    private EstadoPago estadoPago = EstadoPago.PENDIENTE;

    public enum EstadoPago {
        PENDIENTE, PARCIAL, PAGADO
    }

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL)
    private List<VentaProducto> productos = new ArrayList<>();

    public void calcularTotal() {
        this.total = productos.stream()
                .map(VentaProducto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void calcularMontoPagado() {
    this.montoPagado = pagos.stream()
        .map(Pago::getMonto)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
}

public void actualizarEstadoPago() {
    if (montoPagado.compareTo(BigDecimal.ZERO) == 0) {
        this.estadoPago = EstadoPago.PENDIENTE;
    } else if (montoPagado.compareTo(total) < 0) {
        this.estadoPago = EstadoPago.PARCIAL;
    } else {
        this.estadoPago = EstadoPago.PAGADO;
    }
}
public void actualizarTotalesYEstado() {
    calcularTotal();
    calcularMontoPagado();
    actualizarEstadoPago();
}

}
