package ies.juanbosoco.locuventas_backend.controllers;
import ies.juanbosoco.locuventas_backend.DTO.pais.PaisResponseDTO;
import ies.juanbosoco.locuventas_backend.DTO.vendedor.LoginRequestDTO;
import ies.juanbosoco.locuventas_backend.DTO.vendedor.LoginResponseDTO;
import ies.juanbosoco.locuventas_backend.DTO.vendedor.UserEditDTO;
import ies.juanbosoco.locuventas_backend.DTO.vendedor.UserRegisterDTO;
import ies.juanbosoco.locuventas_backend.config.JwtTokenProvider;
import ies.juanbosoco.locuventas_backend.constants.Roles;
import ies.juanbosoco.locuventas_backend.entities.Pais;
import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import ies.juanbosoco.locuventas_backend.repositories.UserEntityRepository;
import ies.juanbosoco.locuventas_backend.services.FotoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class AuthController {
    @Autowired
    private UserEntityRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenProvider tokenProvider;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private FotoService fotoVendedorService;
    @PostMapping("/auth/register")
    public ResponseEntity<Map<String, String>> save(
            @Valid @RequestPart("user") UserRegisterDTO userDTO,
            @RequestPart(value = "foto", required = false) MultipartFile foto,
            BindingResult result) {

        // 1. Si hay errores de validación del DTO, los devuelve Spring automáticamente,
        // 2. Validar la foto SOLO si el DTO es válido (no hace falta comprobar result.hasErrors())
        if (foto == null || foto.isEmpty()) {
            // El único error posible es el de la foto
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("foto", "Debes seleccionar una foto."));
        }

        try {
            // Validar y guardar la foto
            fotoVendedorService.validarArchivo(foto);
            String fotoNombre = fotoVendedorService.generarNombreUnico(foto);
            fotoVendedorService.guardarImagen(foto, fotoNombre, "vendedores");

            // Guardar el usuario
            Vendedor userEntity = this.userRepository.save(
                    Vendedor.builder()
                            .password(passwordEncoder.encode(userDTO.getPassword()))
                            .email(userDTO.getEmail())
                            .authorities(List.of(Roles.USER))
                            .foto(fotoNombre)
                            .nombre(userDTO.getNombre())
                            .build());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("email", userEntity.getEmail()));

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("email", "Email ya utilizado"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("foto", e.getMessage()));
        } catch (Exception e) {
            // Si es error de archivo/foto, mándalo bajo la clave 'foto' si tiene sentido
            if (e.getMessage() != null &&
                    (e.getMessage().toLowerCase().contains("foto")
                            || e.getMessage().toLowerCase().contains("multipart"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("foto", e.getMessage()));
            }
            // Otros errores inesperados
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }


    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginDTO) {
        try {
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword());

            Authentication auth = authenticationManager.authenticate(authToken);
            Vendedor user = (Vendedor) auth.getPrincipal();

            // Extraer roles en forma de List<String>
            List<String> roles = user.getAuthorities().stream()
                    .map(granted -> granted.getAuthority())
                    .toList();

            // Verificar si es vendedor o admin
            boolean esVendedor = roles.contains(Roles.VENDEDOR);
            boolean esAdmin = roles.contains(Roles.ADMIN);

            if (!esVendedor && !esAdmin) {
                // NO es vendedor ni admin: rechaza login y manda mensaje
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                        Map.of(
                                "message", "Su cuenta aún no ha sido habilitada como vendedor. Espere a que un administrador le otorgue permisos.",
                                "path", "/auth/login",
                                "timestamp", new Date()
                        )
                );
            }

            // Generar el token y devolver todo lo necesario
            String token = tokenProvider.generateToken(auth);

            LoginResponseDTO responseDTO = new LoginResponseDTO(
                    user.getUsername(),  // email
                    token,
                    user.getNombre(),
                    user.getFoto(),
                    roles
            );

            return ResponseEntity.ok(responseDTO);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of(
                            "path", "/auth/login",
                            "message", "Credenciales erróneas",
                            "timestamp", new Date()
                    )
            );
        }
    }


    @GetMapping("/mis-paises")
    @PreAuthorize("hasAnyRole('VENDEDOR', 'ADMIN')")
    public ResponseEntity<List<PaisResponseDTO>> obtenerMisPaises(@AuthenticationPrincipal Vendedor vendedor) {
        List<PaisResponseDTO> paises = vendedor.getPaisesPreferidos().stream()
                .map(this::mapToDTO)
                .toList();

        return ResponseEntity.ok(paises);
    }

    private PaisResponseDTO mapToDTO(Pais pais) {
        return new PaisResponseDTO(
                pais.getId(),
                pais.getNombre(),
                pais.getCodigo(),
                pais.getEnlaceFoto()
        );
    }


    /**
     * Asigna el rol ROLE_VENDEDOR a un usuario ajeno al ADMIN que invoca.
     * Solo puede accederlo ADMIN.
     */
    @PutMapping("/usuarios/{id}/asignar-rol")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> asignarRolVendedor(@PathVariable Long id) {
        // 1) Recuperamos el Authentication del contexto (el filtro JWT ya lo habrá llenado)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            // Si no hay Authentication, devolvemos 401
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Debes iniciar sesión como admin."));
        }

        // 2) Extraemos el username/email del principal.
        // Puede venir como String (username) o como UserDetails.
        String emailAdmin;
        Object principalObj = auth.getPrincipal();
        if (principalObj instanceof UserDetails) {
            emailAdmin = ((UserDetails) principalObj).getUsername();
        } else if (principalObj instanceof String) {
            emailAdmin = (String) principalObj;
        } else {
            // Si no es ninguno de los dos, devolvemos 401
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Debes iniciar sesión como admin."));
        }

        // 3) Buscamos en BD al administrador real
        Vendedor currentUser = userRepository.findByEmail(emailAdmin).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Administrador no encontrado."));
        }

        // 4) Evitamos que el ADMIN se asigne el rol a sí mismo → 403 Forbidden
        if (currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "No puedes asignarte el rol a ti mismo."));
        }

        // 5) Buscamos al usuario destino (el que recibimos en la URL)
        Optional<Vendedor> optional = userRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado."));
        }
        Vendedor user = optional.get();

        // 6) Si ese usuario ya tiene ROLE_VENDEDOR, devolvemos 400 Bad Request
        boolean yaEsVendedor = user.getAuthorities().stream()
                .anyMatch(gr -> gr.getAuthority().equals(Roles.VENDEDOR));
        if (yaEsVendedor) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El usuario ya tiene el rol de VENDEDOR."));
        }

        // 7) Asignamos el rol y guardamos
        user.getAuthoritiesRaw().add(Roles.VENDEDOR);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Rol VENDEDOR asignado correctamente."));
    }

    /**
     * Elimina el rol ROLE_VENDEDOR de un usuario que ya lo tenía.
     * Solo puede accederlo ADMIN.
     */
    @PutMapping("/usuarios/{id}/quitar-rol")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> quitarRolVendedor(@PathVariable Long id) {
        // 1) Obtenemos el Authentication del contexto
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Debes iniciar sesión como admin."));
        }

        // 2) Extraemos el email/username del principal
        String emailAdmin;
        Object principalObj = auth.getPrincipal();
        if (principalObj instanceof UserDetails) {
            emailAdmin = ((UserDetails) principalObj).getUsername();
        } else if (principalObj instanceof String) {
            emailAdmin = (String) principalObj;
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Debes iniciar sesión como admin."));
        }

        // 3) Buscamos en BD al administrador real
        Vendedor currentUser = userRepository.findByEmail(emailAdmin).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Administrador no encontrado."));
        }

        // 4) Evitamos que el ADMIN se quite a sí mismo → 403 Forbidden
        if (currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "No puedes quitarte el rol a ti mismo."));
        }

        // 5) Buscamos al usuario destino
        Optional<Vendedor> optional = userRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado."));
        }
        Vendedor user = optional.get();

        // 6) Si ese usuario NO tiene ROLE_VENDEDOR, devolvemos 400 Bad Request
        boolean tieneRolVendedor = user.getAuthorities().stream()
                .anyMatch(gr -> gr.getAuthority().equals(Roles.VENDEDOR));
        if (!tieneRolVendedor) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El usuario no tiene el rol de VENDEDOR."));
        }

        // 7) Quitamos el rol y guardamos
        user.getAuthoritiesRaw().remove(Roles.VENDEDOR);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Rol VENDEDOR eliminado correctamente."));
    }

    /**
     * Devuelve todos los usuarios que NO tienen ni ROLE_VENDEDOR ni ROLE_ADMIN.
     * Es decir, aquellos cuya única autoridad es ROLE_USER.
     * Solo puede accederlo ADMIN.
     */
    @GetMapping("/usuarios/sinrol")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> listarUsuariosSoloUser() {
        // 1) (Opcional) podrías obtener el Authentication y comprobar si es null,
        //    pero @PreAuthorize ya garantiza que el que entra tiene ROLE_ADMIN.
        //    Si quieres, puedes replicar la misma verificación que en los otros métodos:
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Debes iniciar sesión como admin."));
        }

        // 2) Obtiene todos los usuarios de la BD y filtra los que NO tienen ROLE_VENDEDOR ni ROLE_ADMIN
        List<Vendedor> usuariosSoloUser = userRepository.findAll().stream()
                .filter(u ->
                        u.getAuthorities().stream()
                                .noneMatch(gr -> gr.getAuthority().equals(Roles.VENDEDOR)
                                        || gr.getAuthority().equals(Roles.ADMIN))
                )
                .collect(Collectors.toList());

        // 3) Si quieres, podrías comprobar que la lista no venga vacía,
        //    pero normalmente devolvemos 200 con lista vacía si no hay coincidencias
        return ResponseEntity.ok(usuariosSoloUser);
    }
    @DeleteMapping("/usuarios/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        Optional<Vendedor> optional = userRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado."));
        }
        Vendedor user = optional.get();

        // Eliminar la foto si existe
        if (user.getFoto() != null && !user.getFoto().isBlank()) {
            try {
                fotoVendedorService.eliminarImagen(user.getFoto(), "vendedores");
            } catch (Exception e) {
                // No impedimos la eliminación del usuario por error de archivo
            }
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Usuario y foto eliminados correctamente."));
    }
    @PutMapping("/usuarios/editar-perfil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> editarPerfil(
            Principal principal,
            @RequestPart("user") @Valid UserEditDTO userEditDTO,
            @RequestPart(value = "foto", required = false) MultipartFile foto,
            BindingResult result
    ) {
        // 1. Recuperar usuario autenticado por email (desde el token)
        String email = principal.getName();
        Vendedor usuario = userRepository.findByEmail(email).orElse(null);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Usuario no autenticado"));
        }

        // 2. Validaciones de campos
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(fieldError ->
                    errors.put(fieldError.getField(), fieldError.getDefaultMessage())
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        // 3. Comprobar duplicidad de email si lo cambió
        if (!usuario.getEmail().equals(userEditDTO.getEmail())) {
            boolean emailEnUso = userRepository.findByEmail(userEditDTO.getEmail()).isPresent();
            if (emailEnUso) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("email", "Ese email ya está en uso"));
            }
            usuario.setEmail(userEditDTO.getEmail());
        }

        // 4. Cambiar nombre si lo cambia
        usuario.setNombre(userEditDTO.getNombre());

        // 5. Cambiar contraseña si la introduce
        if (userEditDTO.getPassword() != null && !userEditDTO.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(userEditDTO.getPassword()));
        }

        // 6. Cambiar la foto si la subió (y borrar la anterior)
        if (foto != null && !foto.isEmpty()) {
            // Borrar la anterior si existe
            if (usuario.getFoto() != null && !usuario.getFoto().isBlank()) {
                try {
                    fotoVendedorService.eliminarImagen(usuario.getFoto(), "vendedores");
                } catch (Exception e) {
                    // Ignora errores de borrado de archivo
                }
            }
            // Guardar la nueva
            fotoVendedorService.validarArchivo(foto);
            String nuevoNombreFoto = fotoVendedorService.generarNombreUnico(foto);
            fotoVendedorService.guardarImagen(foto, nuevoNombreFoto, "vendedores");
            usuario.setFoto(nuevoNombreFoto);
        }

        userRepository.save(usuario);

        // 7. Respuesta
        Map<String, Object> response = new HashMap<>();
        response.put("nombre", usuario.getNombre());
        response.put("email", usuario.getEmail());
        response.put("foto", usuario.getFoto());
        response.put("message", "Perfil actualizado correctamente.");

        return ResponseEntity.ok(response);
    }


}

