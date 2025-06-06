package ies.juanbosoco.locuventas_backend.controllers;
import ies.juanbosoco.locuventas_backend.DTO.LoginRequestDTO;
import ies.juanbosoco.locuventas_backend.DTO.LoginResponseDTO;
import ies.juanbosoco.locuventas_backend.DTO.PaisResponseDTO;
import ies.juanbosoco.locuventas_backend.DTO.UserRegisterDTO;
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
            @Valid @RequestPart("user") UserRegisterDTO userDTO,  // El DTO que contiene los datos del usuario
            @RequestPart("foto") MultipartFile foto,  // El archivo (foto) enviado como parte de la solicitud multipart, BindingResult result) {
            BindingResult result){ if (foto.isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "La foto no puede estar vacía"));
    }
        // Validar errores de validación de los parámetros (por ejemplo, nombre, email, password)
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        try {
            // Validar y guardar la foto
            fotoVendedorService.validarArchivo(foto);  // Validamos la foto con el servicio
            String fotoNombre = fotoVendedorService.generarNombreUnico(foto);  // Generamos un nombre único para la foto
            fotoVendedorService.guardarImagen(foto, fotoNombre);  // Guardamos la foto en el sistema de archivos

            // Guardar el usuario en la base de datos
            Vendedor userEntity = this.userRepository.save(
                    Vendedor.builder()
                            .password(passwordEncoder.encode(userDTO.getPassword()))
                            .email(userDTO.getEmail())
                            .authorities(List.of(Roles.USER))
                            .foto(fotoNombre)  // Guardamos el nombre de la foto (la ruta o nombre único generado)
                            .nombre(userDTO.getNombre())
                            .build());

            // Respuesta exitosa
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of("email", userEntity.getEmail())
            );

        } catch (DataIntegrityViolationException e) {
            // Manejo de errores por duplicidad de email
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email ya utilizado"));
        } catch (IllegalArgumentException e) {
            // Manejo de errores de validación de la foto (por ejemplo, tamaño o tipo incorrecto)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // Manejo de otros errores generales
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

            // Generar el token
            String token = tokenProvider.generateToken(auth);

            // Extraer roles en forma de List<String>
            List<String> roles = user.getAuthorities().stream()
                    .map(granted -> granted.getAuthority())
                    .toList();

            // Construir respuesta con roles incluidos
            LoginResponseDTO responseDTO = new LoginResponseDTO(
                    user.getUsername(),  // email
                    token,
                    user.getNombre(),    // nombre
                    user.getFoto(),      // foto
                    roles                // lista de roles
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
                fotoVendedorService.eliminarImagen(user.getFoto());
            } catch (Exception e) {
                // No impedimos la eliminación del usuario por error de archivo
            }
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Usuario y foto eliminados correctamente."));
    }


}

