package ies.juanbosoco.locuventas_backend.DTO.pais;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaisResponseDTO {
    private Long id;
    private String nombre;
    private String codigo;
    private String enlaceFoto;
}
