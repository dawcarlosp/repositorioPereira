package ies.juanbosoco.locuventas_backend.DTO;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    private String email;
    private String token;
    private String nombre;
    private String foto;
}
