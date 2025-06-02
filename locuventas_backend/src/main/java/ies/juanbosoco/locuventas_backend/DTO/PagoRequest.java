package ies.juanbosoco.locuventas_backend.DTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

public class PagoRequest {
    @NotNull
    @Getter
    @Setter
    @DecimalMin("0.01")
    private BigDecimal monto;
}
