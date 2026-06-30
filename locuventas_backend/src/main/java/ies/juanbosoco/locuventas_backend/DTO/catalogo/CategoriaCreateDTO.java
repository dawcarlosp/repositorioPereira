package ies.juanbosoco.locuventas_backend.DTO.catalogo;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaCreateDTO {
    @NotBlank(message = "El nombre de la categoría es obligatorio")
    private String nombre;
}
