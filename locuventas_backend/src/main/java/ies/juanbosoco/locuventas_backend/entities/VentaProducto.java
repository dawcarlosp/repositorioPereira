package ies.juanbosoco.locuventas_backend.entities;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Builder
@Table(name = "venta_productos")
public class VentaProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "venta_id", nullable = false)
    private Venta venta;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    private int cantidad;

    private BigDecimal subtotal;

    public void recalcularSubtotal() {
    if (producto != null && producto.getPrecio() != null) {
        this.subtotal = producto.getPrecio().multiply(BigDecimal.valueOf(cantidad));
    } else {
        this.subtotal = BigDecimal.ZERO;
    }
}
}
