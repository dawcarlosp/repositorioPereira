package ies.juanbosoco.locuventas_backend.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class VentaResponseDTO {
    private Long id;
    private BigDecimal total;
    private BigDecimal montoPagado;
    private BigDecimal saldo;
    private String estadoPago;
    private String vendedor;
    private LocalDateTime fecha;
    private boolean cancelada;
    private List<LineaVentaResponseDTO> lineas;
}
