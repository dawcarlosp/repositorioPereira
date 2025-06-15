package ies.juanbosoco.locuventas_backend.wrapper;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.web.multipart.MultipartFile;
@Schema(name = "RegisterRequest", description = "Formulario de registro")
public class RegisterRequest {
    @Schema(description = "Datos del usuario en formato JSON (nombre, email, password)", type = "string", format = "binary")
    public String user;

    @Schema(description = "Archivo de imagen para la foto de perfil", type = "string", format = "binary")
    public MultipartFile foto;
}
