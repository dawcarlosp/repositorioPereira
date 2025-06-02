package ies.juanbosoco.locuventas_backend.DTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ProductoCreateDTO {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @DecimalMin(value = "0.01", message = "El precio debe ser mayor que 0")
    private BigDecimal precio;

    @NotNull(message = "El país es obligatorio")
    private Long paisId;

    @NotEmpty(message = "Debe incluir al menos una categoría")
    private List<Long> categoriaIds;
}
