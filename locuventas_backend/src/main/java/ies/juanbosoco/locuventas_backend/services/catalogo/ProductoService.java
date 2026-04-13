package ies.juanbosoco.locuventas_backend.services.catalogo;

import ies.juanbosoco.locuventas_backend.DTO.common.PageDTO;
import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoCreateDTO;
import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoResponseDTO;
import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoUpdateDTO;
import ies.juanbosoco.locuventas_backend.entities.catalogo.*;
import ies.juanbosoco.locuventas_backend.errors.BusinessException;
import ies.juanbosoco.locuventas_backend.errors.exceptions.UserNotFoundException;
import ies.juanbosoco.locuventas_backend.mappers.ProductoMapper;
import ies.juanbosoco.locuventas_backend.repositories.catalogo.CategoriaRepository;
import ies.juanbosoco.locuventas_backend.repositories.catalogo.PaisRepository;
import ies.juanbosoco.locuventas_backend.repositories.catalogo.ProductoRepository;
import ies.juanbosoco.locuventas_backend.repositories.venta.VentaProductoRepository;
import ies.juanbosoco.locuventas_backend.services.media.FotoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoService {
    private static final Logger log = LoggerFactory.getLogger(ProductoService.class);

    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private CategoriaRepository categoriaRepository;
    @Autowired
    private PaisRepository paisRepository;
    @Autowired
    private FotoService fotoProductoService;
    @Autowired
    private VentaProductoRepository ventaProductosRepository;
    @Autowired
    private ProductoMapper productoMapper;

        public PageDTO<ProductoResponseDTO> getAllProductos(int page, int size) {
            Pageable pageable = PageRequest.of(page, size, Sort.by("nombre").ascending());
            Page<Producto> productosPage = productoRepository.findAllWithCategories(pageable);

            List<ProductoResponseDTO> content = productosPage.getContent().stream()
                    .map(productoMapper::mapToResponseDTO)
                    .toList();

            return new PageDTO<>(
                    content,
                    productosPage.getNumber(),
                    productosPage.getTotalPages(),
                    productosPage.getTotalElements()
            );
        }


    @Transactional
    public ProductoResponseDTO crearProducto(ProductoCreateDTO dto, MultipartFile foto) {
        if (productoRepository.existsByNombre(dto.getNombre())) {
            throw new BusinessException("Ya existe un producto con ese nombre", HttpStatus.BAD_REQUEST);
        }
        // 1. Validaciones previas (Producto, País, Foto, Categorías existentes) igual que antes...
        Pais pais = paisRepository.findById(dto.getPaisId())
                .orElseThrow(() -> new UserNotFoundException("País no encontrado"));

        List<Categoria> categoriasEncontradas = categoriaRepository.findAllById(dto.getCategoriaIds());

        // 2. Gestión de imagen
        String nombreFoto = fotoProductoService.prepararNombre(foto);
        fotoProductoService.guardarFotoProducto(foto, nombreFoto);
        String rutaRelativa = "productos/" + nombreFoto;

        // 3. Crear instancia de Producto (SIN las categorías todavía)
        Producto producto = Producto.builder()
                .nombre(dto.getNombre())
                .precio(dto.getPrecio())
                .iva(dto.getIva())
                .foto(rutaRelativa)
                .pais(pais)
                .build();

        // 4. PERSISTENCIA INICIAL
        // Necesitamos el ID del producto para el ID embebido de la relación
        final Producto productoGuardado = productoRepository.save(producto);

        // 5. Crear las relaciones usando el ID ya generado
        List<ProductoCategoria> relaciones = categoriasEncontradas.stream()
                .map(cat -> {
                    ProductoCategoria rel = new ProductoCategoria();
                    rel.setProducto(productoGuardado);
                    rel.setCategoria(cat);
                    // Seteamos el ID manual para evitar errores de persistencia
                    rel.setId(new ProductoCategoriaId(productoGuardado.getId(), cat.getId()));
                    return rel;
                })
                .collect(Collectors.toCollection(ArrayList::new));;

        // 6. Asignar y volver a guardar (Hibernate gestiona el update)
        productoGuardado.setCategorias(relaciones);
        return productoMapper.mapToResponseDTO(productoRepository.save(productoGuardado));
    }


    @Transactional
    public ProductoResponseDTO editarProducto(Long id, ProductoUpdateDTO dto, MultipartFile foto) {
        // 1. Recuperar el producto
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Producto no encontrado", HttpStatus.NOT_FOUND));

        // 2. Validar País
        Pais pais = paisRepository.findById(dto.getPaisId())
                .orElseThrow(() -> new BusinessException("País no encontrado", HttpStatus.NOT_FOUND));

        // 3. Validar Categorías
        List<Categoria> categorias = categoriaRepository.findAllById(dto.getCategoriaIds());
        if (categorias.size() != dto.getCategoriaIds().size()) {
            throw new BusinessException("Una o más categorías no existen", HttpStatus.BAD_REQUEST);
        }

        // 4. Actualizar campos básicos
        producto.setNombre(dto.getNombre());
        producto.setPrecio(dto.getPrecio());
        producto.setIva(dto.getIva());
        producto.setPais(pais);

        // 5. Gestionar Categorías (Relación intermedia)
        // Limpiamos las antiguas y añadimos las nuevas en una lista MUTABLE
        producto.getCategorias().clear();
        List<ProductoCategoria> nuevasRelaciones = categorias.stream()
                .map(cat -> ProductoCategoria.builder()
                        .producto(producto)
                        .categoria(cat)
                        .id(new ProductoCategoriaId(producto.getId(), cat.getId()))
                        .build())
                .collect(Collectors.toCollection(ArrayList::new)); // CRÍTICO: Mutable

        producto.getCategorias().addAll(nuevasRelaciones);

        // 6. Gestionar Foto
        if (foto != null && !foto.isEmpty()) {
            // Borrar la vieja si existe (evitando borrar las precargadas si quieres conservarlas)
            if (producto.getFoto() != null && !producto.getFoto().contains("productosprecargados/")) {
                try {
                    fotoProductoService.eliminarImagen(producto.getFoto(), "productos");
                } catch (Exception e) {
                    // Loguear error pero no detener la edición
                }
            }

            String nuevoNombre = fotoProductoService.prepararNombre(foto);
            fotoProductoService.guardarFotoProducto(foto, nuevoNombre);

            // Guardamos con el prefijo "productos/" para consistencia
            producto.setFoto("productos/" + nuevoNombre);
        }

        return productoMapper.mapToResponseDTO(productoRepository.save(producto));
    }

    @Transactional
    public void eliminarProducto(Long id) {
        // 1. Buscar el producto o lanzar 404
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("El producto con ID " + id + " no existe", HttpStatus.NOT_FOUND));

        // 2. Validar si tiene ventas asociadas (Conflict - 409)
        // Asumo que tu repositorio de ventas se llama ventaProductosRepository
        if (ventaProductosRepository.existsByProducto_Id(id)) {
            throw new BusinessException("No se puede eliminar: el producto ya tiene ventas registradas", HttpStatus.CONFLICT);
        }

        // 3. Gestión de la Foto
        if (producto.getFoto() != null && !producto.getFoto().isBlank()) {
            // Evitamos borrar las precargadas para no romper el entorno de desarrollo/pruebas
            if (!producto.getFoto().contains("productosprecargados/")) {
                try {
                    fotoProductoService.eliminarImagen(producto.getFoto(), "productos");
                } catch (Exception e) {
                    log.error("No se pudo eliminar el archivo físico del producto {}: {}", id, e.getMessage());
                }
            }
        }

        // 4. Borrado
        // Gracias a 'orphanRemoval = true' y 'CascadeType.ALL' en la entidad Producto,
        // al borrar el producto se borrarán automáticamente sus entradas en 'producto_categoria'.
        productoRepository.delete(producto);
    }
}
