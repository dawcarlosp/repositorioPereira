package ies.juanbosoco.locuventas_backend.DTO.vendedor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.hibernate.validator.constraints.Length;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserEditDTO {
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene el formato válido")
    @Length(max = 100, message = "El email es demasiado largo")
    private String email;

    @NotBlank(message = "Debe proporcionar una contraseña")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&.])[A-Za-z\\d@$!%*?&.]{8,}$",
            message = "La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, un número y un carácter especial")

    private String password;

    @Length(min = 3, max = 50, message = "El nombre requiere minimo tres caracteres y máximo 50")
    @Pattern(regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$", message = "El nombre solo puede contener letras y espacios")
    @NotBlank(message = "El nombre completo es obligatorio")
    private String nombre;
}
