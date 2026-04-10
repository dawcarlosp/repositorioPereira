package ies.juanbosoco.locuventas_backend;

import ies.juanbosoco.locuventas_backend.DTO.vendedor.LoginRequestDTO;
import ies.juanbosoco.locuventas_backend.DTO.vendedor.LoginResponseDTO;
import ies.juanbosoco.locuventas_backend.DTO.vendedor.UserRegisterDTO;
import ies.juanbosoco.locuventas_backend.config.JwtTokenProvider;
import ies.juanbosoco.locuventas_backend.constants.Roles;
import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import ies.juanbosoco.locuventas_backend.errors.BusinessException;
import ies.juanbosoco.locuventas_backend.errors.InsufficientPermissionsException;
import ies.juanbosoco.locuventas_backend.errors.UserAlreadyExistsException;
import ies.juanbosoco.locuventas_backend.repositories.UserEntityRepository;
import ies.juanbosoco.locuventas_backend.services.AuthService;
import ies.juanbosoco.locuventas_backend.services.FotoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
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

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

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
    @DisplayName("Debe encriptar la contraseña y asignar el rol USER correctamente")
    void register_DataMapping_Success() {
        // GIVEN
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(fotoVendedorService.prepararNombre(any())).thenReturn("uuid-foto.jpg");
        when(passwordEncoder.encode(anyString())).thenReturn("contraseñaEncriptada");

        // WHEN
        authService.register(userDTO, foto);

        // THEN
        ArgumentCaptor<Vendedor> vendedorCaptor = ArgumentCaptor.forClass(Vendedor.class);
        verify(userRepository).save(vendedorCaptor.capture());

        Vendedor vendedorGuardado = vendedorCaptor.getValue();
        assertEquals("contraseñaEncriptada", vendedorGuardado.getPassword());

        // AQUÍ ESTÁ EL CAMBIO: Comparamos contra lo que definiste en el setUp
        assertEquals(userDTO.getEmail(), vendedorGuardado.getEmail());

        assertTrue(vendedorGuardado.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(Roles.USER)));
    }

    @Test
    @DisplayName("Debe lanzar UserAlreadyExistsException si el email ya está en uso")
    void register_UserExists_ThrowsException() {
        // GIVEN
        when(userRepository.existsByEmail(userDTO.getEmail())).thenReturn(true);

        // WHEN & THEN
        assertThrows(UserAlreadyExistsException.class, () -> authService.register(userDTO, foto));

        // Verificamos que no se intentó guardar nada
        verify(userRepository, never()).save(any());
        verify(fotoVendedorService, never()).guardarFotoVendedor(any(), any());
    }

    @Test
    @DisplayName("Debe eliminar la imagen si el guardado en base de datos falla (Rollback manual)")
    void register_DatabaseFail_DeletesImage() {
        // GIVEN
        String nombreArchivo = "foto-temporal.jpg";
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(fotoVendedorService.prepararNombre(any())).thenReturn(nombreArchivo);

        // Simulamos que el save falla lanzando una excepción genérica
        when(userRepository.save(any())).thenThrow(new RuntimeException("Error fatal de DB"));

        // WHEN & THEN
        assertThrows(RuntimeException.class, () -> authService.register(userDTO, foto));

        // VERIFICACIÓN DE ORO: Se debe haber llamado a eliminarImagen
        verify(fotoVendedorService).eliminarImagen(nombreArchivo, "vendedores");
    }

    @Test
    @DisplayName("No debe guardar en DB si la validación o guardado de la foto falla")
    void register_ImageError_NoDatabaseInsert() {
        // GIVEN
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(fotoVendedorService.prepararNombre(any())).thenReturn("foto.jpg");

        // doThrow se usa para métodos que devuelven 'void'
        doThrow(new RuntimeException("Error al escribir en disco"))
                .when(fotoVendedorService).guardarFotoVendedor(any(), anyString());

        // WHEN & THEN
        assertThrows(RuntimeException.class, () -> authService.register(userDTO, foto));

        // Verificamos que nunca se llamó al save
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Login exitoso: Debe devolver el DTO con el token cuando las credenciales y roles son correctos")
    void login_Success() {
        // GIVEN
        LoginRequestDTO loginDTO = new LoginRequestDTO("test@example.com", "Password123!");

        // Simulamos el usuario que devuelve Spring Security
        Vendedor vendedor = Vendedor.builder()
                .email("test@example.com")
                .nombre("Juan Perez")
                .authorities(List.of(Roles.VENDEDOR)) // Tiene el rol necesario
                .build();

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(vendedor);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("jwt-token-generado");

        // WHEN
        LoginResponseDTO response = authService.login(loginDTO);

        // THEN
        assertNotNull(response);
        assertEquals("jwt-token-generado", response.getToken());
        assertEquals("test@example.com", response.getEmail());
        assertTrue(response.getRoles().contains(Roles.VENDEDOR));
    }

    @Test
    @DisplayName("Login fallido: Debe lanzar InsufficientPermissionsException si no es Vendedor ni Admin")
    void login_InsufficientPermissions_ThrowsException() {
        // GIVEN
        LoginRequestDTO loginDTO = new LoginRequestDTO("test@example.com", "Password123!");

        // Usuario autenticado pero solo con rol USER (no habilitado para ventas)
        Vendedor vendedor = Vendedor.builder()
                .email("test@example.com")
                .authorities(List.of(Roles.USER))
                .build();

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(vendedor);
        when(authenticationManager.authenticate(any())).thenReturn(auth);

        // WHEN & THEN
        assertThrows(InsufficientPermissionsException.class, () -> authService.login(loginDTO));

        // Verificamos que NUNCA se generó el token por falta de permisos
        verify(tokenProvider, never()).generateToken(any());
    }

    @Test
    @DisplayName("Login fallido: Debe propagar BadCredentialsException si la autenticación falla")
    void login_BadCredentials_ThrowsException() {
        // GIVEN
        LoginRequestDTO loginDTO = new LoginRequestDTO("mal@example.com", "wrong-pass");

        // Simulamos que el AuthenticationManager de Spring Security lanza el error
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Credenciales inválidas"));

        // WHEN & THEN
        assertThrows(BadCredentialsException.class, () -> authService.login(loginDTO));
    }

    @Test
    void asignarRol_SelfAssignment_ThrowsException() {
        // ... setup mocks ...
        BusinessException ex = assertThrows(BusinessException.class,
                () -> authService.asignarRolVendedor(1L, "admin@test.com"));

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatus());
    }
}