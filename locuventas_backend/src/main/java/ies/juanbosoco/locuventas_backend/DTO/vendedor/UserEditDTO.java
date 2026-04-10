package ies.juanbosoco.locuventas_backend.DTO.vendedor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.validator.constraints.Length;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserEditDTO {
    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;

    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "El formato del email no es válido")
    private String email;

    // La contraseña es opcional en la edición
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;
}
