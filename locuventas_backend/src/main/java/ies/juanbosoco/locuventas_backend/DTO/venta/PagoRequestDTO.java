package ies.juanbosoco.locuventas_backend.DTO.venta;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class PagoRequestDTO {
    @NotNull
    @DecimalMin("0.01")
    private BigDecimal monto;
}
