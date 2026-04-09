package ies.juanbosoco.locuventas_backend.services;

import ies.juanbosoco.locuventas_backend.DTO.vendedor.LoginRequestDTO;
import ies.juanbosoco.locuventas_backend.DTO.vendedor.LoginResponseDTO;
import ies.juanbosoco.locuventas_backend.DTO.vendedor.UserRegisterDTO;
import ies.juanbosoco.locuventas_backend.config.JwtTokenProvider;
import ies.juanbosoco.locuventas_backend.constants.Roles;
import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import ies.juanbosoco.locuventas_backend.errors.InsufficientPermissionsException;
import ies.juanbosoco.locuventas_backend.errors.UserAlreadyExistsException;
import ies.juanbosoco.locuventas_backend.repositories.UserEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.support.*;

import java.util.List;
import java.util.Map;

@Service
public class AuthService {
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

    @Transactional(rollbackFor = Exception.class)
    public Map<String, String> register(UserRegisterDTO userDTO, MultipartFile foto) {

        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new UserAlreadyExistsException(userDTO.getEmail());
        }

        String nombreArchivo = fotoVendedorService.prepararNombre(foto);

        try {
            fotoVendedorService.guardarFotoVendedor(foto, nombreArchivo);

            Vendedor userEntity = Vendedor.builder()
                    .password(passwordEncoder.encode(userDTO.getPassword()))
                    .email(userDTO.getEmail())
                    .authorities(List.of(Roles.USER))
                    .foto(nombreArchivo)
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
}

