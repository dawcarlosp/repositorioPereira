package ies.juanbosoco.locuventas_backend.DTO.catalogo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaResponseDTO {
    private Long id;
    private String nombre;
}
