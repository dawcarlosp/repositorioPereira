package ies.juanbosoco.locuventas_backend.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VentaRequestDTO {
    @NotNull
    private List<LineaVentaDTO> lineas;
}
