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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

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
    @PutMapping("/usuarios/{id}/asignar-rol")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> asignarRolVendedor(
            @PathVariable Long id,
            @AuthenticationPrincipal Vendedor currentUser  // obtenemos el usuario logeado
    ) {
        // 1. Si el admin intenta asignarse a sí mismo, devolvemos 403 FORBIDDEN
        if (currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "No puedes asignarte el rol a ti mismo"));
        }

        // 2. Buscamos al usuario destino
        Optional<Vendedor> optional = userRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado"));
        }

        Vendedor user = optional.get();

        // 3. Evitamos duplicar el rol
        if (user.getAuthoritiesRaw().contains(Roles.VENDEDOR)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El usuario ya tiene el rol de VENDEDOR"));
        }

        // 4. Asignamos el rol y guardamos
        user.getAuthoritiesRaw().add(Roles.VENDEDOR);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Rol VENDEDOR asignado correctamente"));
    }


}
