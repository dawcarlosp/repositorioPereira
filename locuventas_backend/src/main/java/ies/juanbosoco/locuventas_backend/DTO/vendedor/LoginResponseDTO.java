package ies.juanbosoco.locuventas_backend.DTO.vendedor;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    private String email;
    private String token;
    private String nombre;
    private String foto;
    private List<String> roles;
}
