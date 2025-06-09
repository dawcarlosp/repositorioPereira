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
    private Double subtotal;
}
