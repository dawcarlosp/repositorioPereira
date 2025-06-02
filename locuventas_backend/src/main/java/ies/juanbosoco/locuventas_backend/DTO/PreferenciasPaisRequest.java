package ies.juanbosoco.locuventas_backend.DTO;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PreferenciasPaisRequest {

    @NotEmpty(message = "Debe seleccionar al menos un país")
    private List<Long> paisIds;
}
