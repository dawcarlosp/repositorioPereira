package ies.juanbosoco.locuventas_backend.services.auth;

import ies.juanbosoco.locuventas_backend.DTO.auth.*;
import ies.juanbosoco.locuventas_backend.config.JwtTokenProvider;
import ies.juanbosoco.locuventas_backend.constants.Roles;
import ies.juanbosoco.locuventas_backend.entities.auth.Vendedor;
import ies.juanbosoco.locuventas_backend.errors.BusinessException;
import ies.juanbosoco.locuventas_backend.errors.exceptions.InsufficientPermissionsException;
import ies.juanbosoco.locuventas_backend.errors.exceptions.UserAlreadyExistsException;
import ies.juanbosoco.locuventas_backend.errors.exceptions.UserNotFoundException;
import ies.juanbosoco.locuventas_backend.mappers.VendedorMapper;
import ies.juanbosoco.locuventas_backend.repositories.auth.UserEntityRepository;
import ies.juanbosoco.locuventas_backend.services.media.FotoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
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
    @Autowired
    private VendedorMapper vendedorMapper;

    @Transactional(rollbackFor = Exception.class)
    public Map<String, String> register(UserRegisterDTO userDTO, MultipartFile foto) {

        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new UserAlreadyExistsException(userDTO.getEmail());
        }

        String nombreArchivo = fotoVendedorService.prepararNombre(foto);
        String rutaRelativa = "vendedores/" + nombreArchivo;
        try {
            fotoVendedorService.guardarFotoVendedor(foto, nombreArchivo);

            Vendedor userEntity = Vendedor.builder()
                    .password(passwordEncoder.encode(userDTO.getPassword()))
                    .email(userDTO.getEmail())
                    .authorities(List.of(Roles.USER))
                    .foto(rutaRelativa)
                    .nombre(userDTO.getNombre())
                    .build();

            userRepository.save(userEntity);
            return Map.of("email", userEntity.getEmail());

        } catch (Exception e) {
            fotoVendedorService.eliminarImagen(nombreArchivo, "vendedores");
            throw e;
        }
    }

    public LoginResponseDTO login(LoginRequestDTO loginDTO) {
        // 1. Autenticación (Si falla, AuthenticationManager lanza AuthenticationException)
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
        );

        Vendedor user = (Vendedor) auth.getPrincipal();

        // 2. Lógica de validación de roles (Regla de negocio)
        List<String> roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        boolean isAuthorized = roles.contains(Roles.VENDEDOR) || roles.contains(Roles.ADMIN);

        if (!isAuthorized) {
            // Usamos una excepción personalizada o una genérica de seguridad
            throw new InsufficientPermissionsException("Su cuenta aún no ha sido habilitada como vendedor.");
        }

        // 3. Generar Token
        String token = tokenProvider.generateToken(auth);

        // 4. Mapear a DTO
        return LoginResponseDTO.builder()
                .email(user.getUsername())
                .token(token)
                .nombre(user.getNombre())
                .foto(user.getFoto())
                .roles(roles)
                .build();
    }

    public void asignarRolVendedor(Long idDestino, String emailAdmin) {
        // 1. Buscamos al Admin
        Vendedor admin = userRepository.findByEmail(emailAdmin)
                .orElseThrow(() -> new BusinessException("Administrador no encontrado", HttpStatus.UNAUTHORIZED));

        // 2. Regla: No auto-asignación (403 Forbidden)
        if (admin.getId().equals(idDestino)) {
            throw new BusinessException("No puedes asignarte el rol de vendedor a ti mismo", HttpStatus.FORBIDDEN);
        }

        // 3. Buscamos al usuario destino (404 Not Found)
        Vendedor usuario = userRepository.findById(idDestino)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado", HttpStatus.NOT_FOUND));

        // 4. Regla: No duplicar roles (400 Bad Request)
        if (usuario.getAuthoritiesRaw().contains(Roles.VENDEDOR)) {
            throw new BusinessException("El usuario ya tiene el rol de VENDEDOR", HttpStatus.BAD_REQUEST);
        }

        // 5. Acción y guardado
        usuario.getAuthoritiesRaw().add(Roles.VENDEDOR);
        userRepository.save(usuario);
    }
    public List<UserResponseDTO> getBasicUsers() {
        return userRepository.findByAuthoritiesNotContaining(Roles.ADMIN, Roles.VENDEDOR)
                .stream()
                .map(vendedorMapper::mapToResponseDTO)
                .toList();
    }

    @Transactional
    public UserResponseDTO editarPerfil(String emailActual, UserEditDTO dto, MultipartFile foto) {
        // 1. Recuperar usuario
        Vendedor usuario = userRepository.findByEmail(emailActual)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        // 2. Validar Email si ha cambiado
        if (!usuario.getEmail().equals(dto.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new BusinessException("El email ya está en uso por otro usuario", HttpStatus.BAD_REQUEST);
            }
            usuario.setEmail(dto.getEmail());
        }

        // 3. Actualizar campos básicos
        usuario.setNombre(dto.getNombre());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        // 4. Gestión de Foto (Usando tu nuevo FotoService)
        if (foto != null && !foto.isEmpty()) {
            String fotoAnterior = usuario.getFoto();

            // Usamos tu método 'prepararNombre' que ya valida y genera el UUID
            String nuevoNombreFoto = fotoVendedorService.prepararNombre(foto);

            // Guardamos la nueva
            fotoVendedorService.guardarFotoVendedor(foto, nuevoNombreFoto);
            usuario.setFoto(nuevoNombreFoto);

            // Borramos la antigua si no era la default (opcional)
            if (fotoAnterior != null && !fotoAnterior.equals("default.jpg")) {
                try {
                    fotoVendedorService.eliminarImagen(fotoAnterior, "vendedores");
                } catch (Exception e) {
                    // Logueamos pero no frenamos la edición por un error de borrado
                }
            }
        }

        Vendedor actualizado = userRepository.save(usuario);

        // 5. Devolvemos el DTO usando el mapper que ya tienes
        return vendedorMapper.mapToResponseDTO(actualizado);
    }

    @Transactional
    public void eliminarUsuario(Long id) {
        // 1. Buscar el usuario o lanzar nuestra excepción personalizada
        Vendedor usuario = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("No se puede eliminar: Usuario no encontrado con ID " + id));

        // 2. Gestionar la eliminación de la foto (si tiene)
        if (usuario.getFoto() != null && !usuario.getFoto().isBlank() && !usuario.getFoto().equals("default.jpg")) {
            try {
                fotoVendedorService.eliminarImagen(usuario.getFoto(), "vendedores");
            } catch (Exception e) {
                // Logueamos el error pero permitimos que continúe el borrado del registro
                log.error("Error al borrar el archivo físico del usuario {}: {}", id, e.getMessage());
            }
        }

        // 3. Eliminar de la base de datos
        userRepository.delete(usuario);
    }

}

