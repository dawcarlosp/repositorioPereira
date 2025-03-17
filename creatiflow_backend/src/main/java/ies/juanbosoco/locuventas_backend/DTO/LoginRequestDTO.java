package ies.juanbosoco.locuventas_backend.DTO;
import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequestDTO {
    private String email;
    private String password;
}
