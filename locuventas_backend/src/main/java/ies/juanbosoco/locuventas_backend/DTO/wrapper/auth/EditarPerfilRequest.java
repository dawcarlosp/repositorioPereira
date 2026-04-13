package ies.juanbosoco.locuventas_backend.DTO.wrapper.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.web.multipart.MultipartFile;

@Schema(name = "EditarPerfilRequest", description = "Formulario de edición de perfil")
public class EditarPerfilRequest {

    @Schema(description = "Datos del usuario en formato JSON (nombre, email, password)", type = "string", format = "binary")
    public String user;

    @Schema(description = "Archivo de la nueva foto de perfil", type = "string", format = "binary")
    public MultipartFile foto;
}
