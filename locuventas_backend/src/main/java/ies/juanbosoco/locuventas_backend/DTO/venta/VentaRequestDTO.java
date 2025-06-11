package ies.juanbosoco.locuventas_backend.DTO.venta;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VentaRequestDTO {
    @NotNull(message = "La lista de productos no puede ser nula")
    @Size(min = 1, message = "Debe haber al menos un producto en la venta")
    private List<@Valid LineaVentaDTO> lineas;

}
