package ies.juanbosoco.locuventas_backend.DTO.producto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductoUpdateDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
    private String nombre;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", inclusive = true, message = "El precio debe ser mayor que 0")
    private BigDecimal precio;

    @NotNull(message = "El IVA es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El IVA no puede ser negativo")
    @DecimalMax(value = "100.0", inclusive = true, message = "El IVA no puede ser mayor al 100%")
    private Double iva;

    @NotNull(message = "El país es obligatorio")
    private Long paisId;

    @NotNull(message = "Debes seleccionar al menos una categoría")
    @Size(min = 1, message = "Debes seleccionar al menos una categoría")
    private List<@NotNull(message = "ID de categoría inválido") Long> categoriaIds;
}
