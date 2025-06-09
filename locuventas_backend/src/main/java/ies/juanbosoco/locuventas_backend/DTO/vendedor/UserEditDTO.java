package ies.juanbosoco.locuventas_backend.DTO.vendedor;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserEditDTO {
    private String nombre;
    private String email;
    private String password; // Opcional
}
