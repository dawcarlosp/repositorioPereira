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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationManager;
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
        // Validación de negocio
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado.");
        }

        String nombreArchivo = fotoVendedorService.prepararNombre(foto);

            // Crear y guardar usuario
            Vendedor userEntity = userRepository.save(
                    Vendedor.builder()
                            .password(passwordEncoder.encode(userDTO.getPassword()))
                            .email(userDTO.getEmail())
                            .authorities(List.of(Roles.USER))
                            .foto(nombreArchivo)
                            .nombre(userDTO.getNombre())
                            .build()
            );

            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    // Este código SOLO corre si la transacción de arriba fue exitosa
                    fotoVendedorService.guardarFotoVendedor(foto, nombreArchivo);
                }
            });

            return Map.of("email", userEntity.getEmail());
    }
}
