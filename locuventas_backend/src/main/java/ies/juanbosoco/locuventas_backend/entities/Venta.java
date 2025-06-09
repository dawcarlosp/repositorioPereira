package ies.juanbosoco.locuventas_backend.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
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

    private boolean cancelada;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "vendedor_id")
    private Vendedor vendedor;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Pago> pagos = new ArrayList<>();

    public enum EstadoPago {
        PENDIENTE,
        PARCIAL,
        PAGADO
    }

    @Enumerated(EnumType.STRING)
    private EstadoPago estadoPago = EstadoPago.PENDIENTE;

    public BigDecimal getMontoPagado() {
        return pagos.stream()
                .map(Pago::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getSaldoPendiente() {
        return total.subtract(getMontoPagado());
    }

    public void actualizarTotalesYEstado() {
        BigDecimal pagado = getMontoPagado();
        if (pagado.compareTo(BigDecimal.ZERO) == 0) {
            estadoPago = EstadoPago.PENDIENTE;
        } else if (pagado.compareTo(total) >= 0) {
            estadoPago = EstadoPago.PAGADO;
        } else {
            estadoPago = EstadoPago.PARCIAL;
        }
    }

    public void cancelar() {
        this.cancelada = true;
    }
}
