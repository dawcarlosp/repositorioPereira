package ies.juanbosoco.locuventas_backend;

import ies.juanbosoco.locuventas_backend.DTO.catalogo.ProductoCreateDTO;
import ies.juanbosoco.locuventas_backend.DTO.catalogo.ProductoResponseDTO;
import ies.juanbosoco.locuventas_backend.entities.catalogo.Categoria;
import ies.juanbosoco.locuventas_backend.entities.catalogo.Pais;
import ies.juanbosoco.locuventas_backend.entities.catalogo.Producto;
import ies.juanbosoco.locuventas_backend.errors.BusinessException;
import ies.juanbosoco.locuventas_backend.repositories.catalogo.CategoriaRepository;
import ies.juanbosoco.locuventas_backend.repositories.catalogo.PaisRepository;
import ies.juanbosoco.locuventas_backend.repositories.catalogo.ProductoRepository;
import ies.juanbosoco.locuventas_backend.repositories.venta.VentaProductoRepository;
import ies.juanbosoco.locuventas_backend.services.media.FotoService;
import ies.juanbosoco.locuventas_backend.services.catalogo.ProductoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock private ProductoRepository productoRepository;
    @Mock private CategoriaRepository categoriaRepository;
    @Mock private PaisRepository paisRepository;
    @Mock private FotoService fotoProductoService;
    @Mock private VentaProductoRepository ventaProductosRepository;

    @InjectMocks
    private ProductoService productoService;

    private Pais paisMock;
    private Categoria categoriaMock;
    private Producto productoMock;

    @BeforeEach
    void setUp() {
        paisMock = new Pais();
        paisMock.setId(1L);
        paisMock.setNombre("España");

        categoriaMock = new Categoria();
        categoriaMock.setId(1L);
        categoriaMock.setNombre("Electrónica");

        productoMock = Producto.builder()
                .id(1L)
                .nombre("Producto Test")
                .precio(new BigDecimal("100.00"))
                .pais(paisMock)
                .foto("productos/test.jpg")
                .build();
    }

    @Test
    @DisplayName("Debería crear un producto correctamente")
    void crearProductoExito() {
        // GIVEN
        ProductoCreateDTO dto = new ProductoCreateDTO();
        dto.setNombre("Nuevo Producto");
        dto.setPaisId(1L);
        dto.setCategoriaIds(List.of(1L));
        dto.setPrecio(new BigDecimal("50.00"));

        MockMultipartFile foto = new MockMultipartFile("foto", "test.jpg", "image/jpeg", "bytes".getBytes());

        when(productoRepository.existsByNombre(anyString())).thenReturn(false);
        when(paisRepository.findById(1L)).thenReturn(Optional.of(paisMock));
        when(categoriaRepository.findAllById(any())).thenReturn(List.of(categoriaMock));
        when(fotoProductoService.prepararNombre(any())).thenReturn("uuid.jpg");
        when(productoRepository.save(any(Producto.class))).thenReturn(productoMock);

        // WHEN
        ProductoResponseDTO result = productoService.crearProducto(dto, foto);

        // THEN
        assertNotNull(result);
        assertEquals(productoMock.getNombre(), result.getNombre());
        verify(fotoProductoService, times(1)).guardarFotoProducto(any(), anyString());
        verify(productoRepository, times(2)).save(any()); // El servicio guarda 2 veces por la relación intermedia
    }

    @Test
    @DisplayName("Debería lanzar excepción si el nombre del producto ya existe")
    void crearProductoErrorNombreDuplicado() {
        ProductoCreateDTO dto = new ProductoCreateDTO();
        dto.setNombre("Existente");

        when(productoRepository.existsByNombre("Existente")).thenReturn(true);

        BusinessException exception = assertThrows(BusinessException.class, () ->
                productoService.crearProducto(dto, null)
        );

        assertEquals("Ya existe un producto con ese nombre", exception.getMessage());
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    }

    @Test
    @DisplayName("Debería lanzar excepción al eliminar un producto que tiene ventas")
    void eliminarProductoErrorVentasAsociadas() {
        // GIVEN
        when(productoRepository.findById(1L)).thenReturn(Optional.of(productoMock));
        when(ventaProductosRepository.existsByProducto_Id(1L)).thenReturn(true);

        // WHEN & THEN
        BusinessException exception = assertThrows(BusinessException.class, () ->
                productoService.eliminarProducto(1L)
        );

        assertEquals(HttpStatus.CONFLICT, exception.getStatus());
        assertTrue(exception.getMessage().contains("ventas registradas"));
        verify(productoRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Debería eliminar producto y su foto si no hay ventas")
    void eliminarProductoExito() {
        // GIVEN
        when(productoRepository.findById(1L)).thenReturn(Optional.of(productoMock));
        when(ventaProductosRepository.existsByProducto_Id(1L)).thenReturn(false);

        // WHEN
        productoService.eliminarProducto(1L);

        // THEN
        verify(fotoProductoService, times(1)).eliminarImagen(anyString(), eq("productos"));
        verify(productoRepository, times(1)).delete(productoMock);
    }
}