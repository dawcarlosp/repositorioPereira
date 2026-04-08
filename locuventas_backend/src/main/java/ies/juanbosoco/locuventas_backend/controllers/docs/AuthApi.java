package ies.juanbosoco.locuventas_backend.controllers.docs;

import ies.juanbosoco.locuventas_backend.DTO.vendedor.UserRegisterDTO;
import ies.juanbosoco.locuventas_backend.common.ApiResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Tag(name = "Autenticación", description = "Endpoints para la gestión de usuarios")
public interface AuthApi {
    @Operation(
            summary = "Registro de nuevo usuario",
            description = "Permite registrar un usuario nuevo con nombre, email, contraseña y una foto de perfil.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Usuario creado correctamente"),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos o email ya usado"),
                    @ApiResponse(responseCode = "500", description = "Error interno del servidor")
            }
    )
    ResponseEntity<ApiResponseDTO<Map<String, String>>> register(
            UserRegisterDTO userDTO,
            MultipartFile foto
    );
}
