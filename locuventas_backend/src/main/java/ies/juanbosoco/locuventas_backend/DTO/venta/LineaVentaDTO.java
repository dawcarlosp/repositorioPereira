package ies.juanbosoco.locuventas_backend.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LineaVentaDTO {
    @NotNull
    private Long productoId;
    @NotNull
    private Integer cantidad;
    @NotNull
    private Double subtotal;
}
