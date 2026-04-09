package ies.juanbosoco.locuventas_backend;

import ies.juanbosoco.locuventas_backend.DTO.vendedor.UserRegisterDTO;
import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import ies.juanbosoco.locuventas_backend.errors.UserAlreadyExistsException;
import ies.juanbosoco.locuventas_backend.repositories.UserEntityRepository;
import ies.juanbosoco.locuventas_backend.services.AuthService;
import ies.juanbosoco.locuventas_backend.services.FotoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // JUnit 5 + Mockito
public class AuthServiceTest {
    @Mock
    private UserEntityRepository userRepository;

    @Mock
    private FotoService fotoVendedorService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService; // Inyecta los mocks de arriba automáticamente

    private UserRegisterDTO userDTO;
    private MockMultipartFile foto;

    @BeforeEach
    void setUp() {
        // Inicializamos datos comunes para cada test
        userDTO = UserRegisterDTO.builder()
                .email("test@example.com")
                .password("Password123!")
                .nombre("Juan Perez")
                .build();

        foto = new MockMultipartFile("foto", "test.jpg", "image/jpeg", "bytes".getBytes());
    }

    @Test
    @DisplayName("Debe registrar un usuario exitosamente cuando los datos son correctos")
    void register_Success() {
        // GIVEN (Configuramos el comportamiento de los mocks)
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(fotoVendedorService.prepararNombre(any())).thenReturn("uuid-test.jpg");
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-password");

        // Simulamos el guardado devolviendo el mismo objeto que se intenta guardar
        when(userRepository.save(any(Vendedor.class))).thenAnswer(i -> i.getArguments()[0]);

        // WHEN (Ejecutamos la acción)
        Map<String, String> result = authService.register(userDTO, foto);

        // THEN (Verificamos resultados y llamadas)
        assertNotNull(result);
        assertEquals("test@example.com", result.get("email"));

        verify(fotoVendedorService).guardarFotoVendedor(eq(foto), eq("uuid-test.jpg"));
        verify(userRepository).save(any(Vendedor.class));
    }

    @Test
    @DisplayName("Debe lanzar UserAlreadyExistsException si el email ya existe")
    void register_EmailAlreadyExists_ThrowsException() {
        // GIVEN
        when(userRepository.existsByEmail(userDTO.getEmail())).thenReturn(true);

        // WHEN & THEN
        assertThrows(UserAlreadyExistsException.class, () -> {
            authService.register(userDTO, foto);
        });

        // Verificamos que NO se intentó guardar la foto ni el usuario
        verify(fotoVendedorService, never()).guardarFotoVendedor(any(), any());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe limpiar la foto si ocurre un error al guardar en base de datos")
    void register_DatabaseError_DeletesPhoto() {
        // GIVEN
        String nombreArchivo = "foto-a-borrar.jpg";
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(fotoVendedorService.prepararNombre(any())).thenReturn(nombreArchivo);

        // Simulamos que la base de datos explota
        when(userRepository.save(any())).thenThrow(new RuntimeException("DB Error"));

        // WHEN & THEN
        assertThrows(RuntimeException.class, () -> authService.register(userDTO, foto));

        // VERIFICACIÓN CRÍTICA: ¿Se llamó a eliminarImagen tras el fallo?
        verify(fotoVendedorService).eliminarImagen(nombreArchivo, "vendedores");
    }
}
