package ies.juanbosoco.locuventas_backend.DTO;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.validator.constraints.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRegisterDTO {
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene el formato válido")
    @Column(unique = true)
    private String email;
    @NotBlank(message = "Debe proporcionar una contraseña")
    private String password;
    //@NotBlank
    //private String password2;
    @Length(min = 3, message = "El nombre requiere minimo tres caracteres")
    @NotBlank(message = "El nombre completo es obligatorio")
    private String nombre;
}
