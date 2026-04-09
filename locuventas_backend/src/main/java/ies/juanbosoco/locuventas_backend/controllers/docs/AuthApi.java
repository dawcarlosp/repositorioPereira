    package ies.juanbosoco.locuventas_backend.controllers.docs;

    import ies.juanbosoco.locuventas_backend.DTO.vendedor.LoginRequestDTO;
    import ies.juanbosoco.locuventas_backend.DTO.vendedor.LoginResponseDTO;
    import ies.juanbosoco.locuventas_backend.DTO.vendedor.RegisterRequest;
    import ies.juanbosoco.locuventas_backend.DTO.vendedor.UserRegisterDTO;
    import ies.juanbosoco.locuventas_backend.common.ApiResponseDTO;
    import io.swagger.v3.oas.annotations.Operation;
    import io.swagger.v3.oas.annotations.media.Content;
    import io.swagger.v3.oas.annotations.media.Encoding;
    import io.swagger.v3.oas.annotations.media.Schema;
    import io.swagger.v3.oas.annotations.parameters.RequestBody;
    import io.swagger.v3.oas.annotations.responses.ApiResponse;
    import io.swagger.v3.oas.annotations.tags.Tag;
    import jakarta.validation.Valid;
    import org.springframework.http.MediaType;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.RequestPart;
    import org.springframework.web.multipart.MultipartFile;

    import java.util.Map;

    @Tag(name = "Autenticación", description = "Endpoints para la gestión de usuarios")
    public interface AuthApi {

        @Operation(
                summary = "Registro de nuevo usuario",
                description = "Registra un vendedor con sus datos y foto de perfil.",
                requestBody = @RequestBody(
                        content = @Content(
                                mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                                // Usamos una implementación que Swagger pueda mapear directamente
                                schema = @Schema(implementation = RegisterRequest.class),
                                encoding = {
                                        @Encoding(name = "user", contentType = MediaType.APPLICATION_JSON_VALUE)
                                }
                        )
                ),
                responses = {
                        @ApiResponse(
                                responseCode = "201",
                                description = "Usuario creado correctamente"
                        ),
                        @ApiResponse(
                                responseCode = "400",
                                description = "Errores de validación (Password débil, nombre corto, etc.)"
                        ),
                        @ApiResponse(
                                responseCode = "409",
                                description = "Conflicto: El email ya está registrado en el sistema"
                        ),
                        @ApiResponse(
                                responseCode = "500",
                                description = "Error interno al procesar la imagen o guardar en disco"
                        )
                }
        )
        ResponseEntity<ApiResponseDTO<Map<String, String>>> register(
                @RequestPart("user") UserRegisterDTO userDTO,
                @RequestPart("foto") MultipartFile foto
        );

        @Operation(
                summary = "Inicio de sesión",
                description = "Autentica al usuario con sus credenciales y devuelve un token JWT si tiene permisos de Vendedor o Admin.",
                requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                        description = "Credenciales de acceso",
                        required = true,
                        content = @Content(schema = @Schema(implementation = LoginRequestDTO.class))
                ),
                responses = {
                        @ApiResponse(
                                responseCode = "200",
                                description = "Autenticación exitosa",
                                content = @Content(schema = @Schema(implementation = LoginResponseDTO.class))
                        ),
                        @ApiResponse(
                                responseCode = "401",
                                description = "Credenciales erróneas (Email o password incorrectos)",
                                content = @Content(schema = @Schema(implementation = ApiResponseDTO.class))
                        ),
                        @ApiResponse(
                                responseCode = "403",
                                description = "Acceso prohibido: El usuario existe pero no tiene permisos habilitados",
                                content = @Content(schema = @Schema(implementation = ApiResponseDTO.class))
                        ),
                        @ApiResponse(
                                responseCode = "400",
                                description = "Formato de petición inválido",
                                content = @Content(schema = @Schema(implementation = ApiResponseDTO.class))
                        )
                }
        )
        @PostMapping("/auth/login")
        public ResponseEntity<ApiResponseDTO<LoginResponseDTO>> login(@Valid @RequestBody LoginRequestDTO loginDTO);
    }