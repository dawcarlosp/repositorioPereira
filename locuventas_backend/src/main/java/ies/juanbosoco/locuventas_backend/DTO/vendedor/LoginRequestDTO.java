package ies.juanbosoco.locuventas_backend.DTO.vendedor;
import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequestDTO {
    private String email;
    private String password;
}
