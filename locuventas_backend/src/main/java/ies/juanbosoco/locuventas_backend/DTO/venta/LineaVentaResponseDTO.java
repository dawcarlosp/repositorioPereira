package ies.juanbosoco.locuventas_backend.DTO.venta;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LineaVentaResponseDTO {
    private Long productoId;
    private String productoNombre;
    private Integer cantidad;
    private Double subtotal;         // Base sin IVA
    private Double iva;              // Porcentaje aplicado (ej: 21.0)
    private Double subtotalConIva;   // subtotal * (1 + iva / 100)
}
