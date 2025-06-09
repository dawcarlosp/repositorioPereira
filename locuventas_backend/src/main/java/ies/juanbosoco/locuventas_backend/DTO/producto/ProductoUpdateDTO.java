package ies.juanbosoco.locuventas_backend.DTO.producto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
@Getter
@Setter
public class ProductoUpdateDTO {
    @NotBlank
    private String nombre;
    @NotNull
    private BigDecimal precio;
    @NotNull
    private Long paisId;
    @NotNull
    private List<Long> categoriaIds;
    // NO pongas foto aquí, ya va en el @RequestPart("foto")
}
