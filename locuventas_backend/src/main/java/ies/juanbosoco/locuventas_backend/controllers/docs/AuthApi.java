    package ies.juanbosoco.locuventas_backend.controllers.docs;

    import ies.juanbosoco.locuventas_backend.DTO.auth.*;
    import ies.juanbosoco.locuventas_backend.DTO.common.ApiResponseDTO;
    import io.swagger.v3.oas.annotations.Operation;
    import io.swagger.v3.oas.annotations.media.Content;
    import io.swagger.v3.oas.annotations.media.Encoding;
    import io.swagger.v3.oas.annotations.media.Schema;
    import io.swagger.v3.oas.annotations.parameters.RequestBody;
    import io.swagger.v3.oas.annotations.responses.ApiResponse;
    import io.swagger.v3.oas.annotations.security.SecurityRequirement;
    import io.swagger.v3.oas.annotations.tags.Tag;
    import jakarta.validation.Valid;
    import org.springframework.http.MediaType;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.multipart.MultipartFile;

    import java.security.Principal;
    import java.util.List;
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

        @Operation(
                summary = "Asignar rol de vendedor",
                description = "Permite a un administrador habilitar a un usuario para vender. No permite la auto-asignación.",
                security = @SecurityRequirement(name = "bearerAuth"),
                responses = {
                        @ApiResponse(responseCode = "200", description = "Rol asignado con éxito"),
                        @ApiResponse(responseCode = "403", description = "No tienes permisos de ADMIN o intentas auto-asignarte"),
                        @ApiResponse(responseCode = "404", description = "El usuario destino no existe"),
                        @ApiResponse(responseCode = "400", description = "El usuario ya era vendedor")
                }
        )
        @PutMapping("/usuarios/{id}/asignar-rol")
        ResponseEntity<ApiResponseDTO<Void>> asignarRolVendedor(@PathVariable Long id, Principal principal);

        @Operation(
                summary = "Listar usuarios sin habilitar",
                description = "Devuelve una lista de usuarios que solo tienen el rol básico (USER) y están pendientes de ser asignados como VENDEDORES.",
                security = @SecurityRequirement(name = "bearerAuth"),
                responses = {
                        @ApiResponse(responseCode = "200", description = "Lista recuperada con éxito"),
                        @ApiResponse(responseCode = "403", description = "No tienes permisos de administrador")
                }
        )
        @GetMapping("/usuarios/sin-rol")
        ResponseEntity<ApiResponseDTO<List<UserResponseDTO>>> getBasicUsers();

        @Operation(
                summary = "Editar perfil de usuario",
                description = "Permite al usuario autenticado modificar sus datos personales y su foto de perfil.",
                security = @SecurityRequirement(name = "bearerAuth"),
                requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                        description = "Datos del usuario en formato JSON y archivo de imagen opcional",
                        content = @Content(
                                mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                                schema = @Schema(implementation = Void.class), // Evitamos confusión de esquemas
                                encoding = {
                                        @Encoding(name = "user", contentType = MediaType.APPLICATION_JSON_VALUE)
                                }
                        )
                ),
                responses = {
                        @ApiResponse(responseCode = "200", description = "Perfil actualizado con éxito"),
                        @ApiResponse(responseCode = "400", description = "Datos inválidos o email ya en uso"),
                        @ApiResponse(responseCode = "401", description = "Token no válido o expirado"),
                        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
                }
        )
        @PutMapping(value = "/usuarios/editar-perfil", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        ResponseEntity<ApiResponseDTO<UserResponseDTO>> editarPerfil(
                Principal principal,
                @RequestPart("user") @Valid UserEditDTO userEditDTO,
                @RequestPart(value = "foto", required = false) MultipartFile foto
        );

        @Operation(
                summary = "Eliminar un usuario (Solo ADMIN)",
                description = "Elimina permanentemente un usuario de la base de datos y borra su foto de perfil del servidor.",
                security = @SecurityRequirement(name = "bearerAuth"),
                responses = {
                        @ApiResponse(responseCode = "200", description = "Usuario eliminado exitosamente"),
                        @ApiResponse(responseCode = "401", description = "No autenticado"),
                        @ApiResponse(responseCode = "403", description = "No tienes permisos de administrador"),
                        @ApiResponse(responseCode = "404", description = "El usuario solicitado no existe")
                }
        )
        @DeleteMapping("/usuarios/{id}")
        ResponseEntity<ApiResponseDTO<Void>> eliminarUsuario(@PathVariable Long id);
    }


