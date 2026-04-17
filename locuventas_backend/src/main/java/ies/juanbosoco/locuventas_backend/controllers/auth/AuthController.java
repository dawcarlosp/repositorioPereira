package ies.juanbosoco.locuventas_backend.controllers.auth;
import ies.juanbosoco.locuventas_backend.DTO.auth.*;
import ies.juanbosoco.locuventas_backend.DTO.common.ApiResponseDTO;
import ies.juanbosoco.locuventas_backend.controllers.docs.AuthApi;
import ies.juanbosoco.locuventas_backend.services.auth.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.*;

@RestController
public class AuthController implements AuthApi {

    @Autowired
    private AuthService authService;

    @PostMapping(value = "/auth/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponseDTO<Map<String, String>>> register(
            @Valid @RequestPart("user") UserRegisterDTO userDTO,
            @RequestPart(value = "foto") MultipartFile foto
    ) {

        Map<String, String> data =  authService.register(userDTO, foto);

        return ApiResponseDTO.success("Usuario creado correctamente", data, HttpStatus.CREATED);
    }


    @PostMapping("/auth/login")
    public ResponseEntity<ApiResponseDTO<LoginResponseDTO>> login(@Valid @RequestBody LoginRequestDTO loginDTO) {

        LoginResponseDTO data = authService.login(loginDTO);

        return ApiResponseDTO.success("Login realizado con éxito", data, HttpStatus.OK);

    }


    /**
     * Asigna el rol ROLE_VENDEDOR a un usuario ajeno al ADMIN que invoca.
     * Solo puede accederlo ADMIN.
     */
    @Override
    @PutMapping("/usuarios/{id}/asignar-rol")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<Void>> asignarRolVendedor(@PathVariable Long id, Principal principal) {

        // principal.getName() nos da el email (el 'subject' del token JWT)
        authService.asignarRolVendedor(id, principal.getName());

        return ApiResponseDTO.success("Rol VENDEDOR asignado correctamente", null, HttpStatus.OK);
    }

    /**
     * Devuelve todos los usuarios que NO tienen ni ROLE_VENDEDOR ni ROLE_ADMIN.
     * Es decir, aquellos cuya única autoridad es ROLE_USER.
     * Solo puede accederlo ADMIN.
     */
    @GetMapping("/usuarios/sin-rol")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<List<UserResponseDTO>>> getBasicUsers() {
        return ApiResponseDTO.success(
                "Usuarios pendientes de habilitar recuperados",
                authService.getBasicUsers(),
                HttpStatus.OK
        );
    }

    @PutMapping(value = "/usuarios/editar-perfil", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> editarPerfil(
            Principal principal,
            @RequestPart("user") @Valid UserEditDTO userEditDTO,
            @RequestPart(value = "foto", required = false) MultipartFile foto
    ) {
        // El email viene del subject del token (Principal)
        UserResponseDTO data = authService.editarPerfil(principal.getName(), userEditDTO, foto);

        return ApiResponseDTO.success("Perfil actualizado correctamente", data, HttpStatus.OK);
    }

    @DeleteMapping("/usuarios/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<Void>> eliminarUsuario(@PathVariable Long id) {
        authService.eliminarUsuario(id);
        return ApiResponseDTO.success("Usuario y archivos asociados eliminados correctamente", null, HttpStatus.OK);
    }
}

