package ies.juanbosoco.locuventas_backend.services;

import ies.juanbosoco.locuventas_backend.DTO.vendedor.UserRegisterDTO;
import ies.juanbosoco.locuventas_backend.config.JwtTokenProvider;
import ies.juanbosoco.locuventas_backend.constants.Roles;
import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import ies.juanbosoco.locuventas_backend.repositories.UserEntityRepository;
import ies.juanbosoco.locuventas_backend.services.utils.FileNameGenerator;
import ies.juanbosoco.locuventas_backend.services.validation.FileValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    @Autowired
    private FileValidator fileValidator;
    @Autowired
    private FileNameGenerator fileNameGenerator;

    public Map<String, String> register(UserRegisterDTO userDTO, MultipartFile foto) {

        // Validar que haya foto
        if (foto == null || foto.isEmpty()) {
            throw new IllegalArgumentException("Debes seleccionar una foto.");
        }

        // Validar y guardar la foto de perfil del usuario
        fileValidator.validarArchivo(foto);
        String fotoNombre = fileNameGenerator.generarNombreUnico(foto);
        fotoVendedorService.guardarFotoVendedor(foto);

        try {
            // Crear y guardar usuario
            Vendedor userEntity = userRepository.save(
                    Vendedor.builder()
                            .password(passwordEncoder.encode(userDTO.getPassword()))
                            .email(userDTO.getEmail())
                            .authorities(List.of(Roles.USER))
                            .foto(fotoNombre)
                            .nombre(userDTO.getNombre())
                            .build()
            );

            return Map.of("email", userEntity.getEmail());

        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Email ya utilizado");
        }
    }
}
