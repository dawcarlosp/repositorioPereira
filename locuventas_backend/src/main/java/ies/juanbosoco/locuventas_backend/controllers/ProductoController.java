package ies.juanbosoco.locuventas_backend.controllers;
import com.fasterxml.jackson.databind.ObjectMapper;
import ies.juanbosoco.locuventas_backend.DTO.common.PageDTO;
import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoCreateDTO;
import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoResponseDTO;
import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoUpdateDTO;
import ies.juanbosoco.locuventas_backend.entities.*;
import ies.juanbosoco.locuventas_backend.repositories.CategoriaRepository;
import ies.juanbosoco.locuventas_backend.repositories.PaisRepository;
import ies.juanbosoco.locuventas_backend.repositories.ProductoRepository;
import ies.juanbosoco.locuventas_backend.repositories.VentaProductoRepository;
import ies.juanbosoco.locuventas_backend.services.FotoService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/productos")
public class ProductoController {
    @Autowired
    private VentaProductoRepository ventaProductosRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private PaisRepository paisRepository;
    @Autowired
    private CategoriaRepository categoriaRepository;
    @Autowired
    private FotoService fotoProductoService;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private Validator validator;

    private ProductoResponseDTO toDto(Producto producto) {
        ProductoResponseDTO dto = new ProductoResponseDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setPrecio(producto.getPrecio());
        dto.setFoto(producto.getFoto());
        dto.setIva(producto.getIva());
        if (producto.getPais() != null) {
            dto.setPaisNombre(producto.getPais().getNombre());
            dto.setPaisFoto(producto.getPais().getEnlaceFoto());
        }
        dto.setCategorias(
                producto.getCategorias() != null ?
                        producto.getCategorias().stream()
                                .map(rel -> rel.getCategoria().getNombre())
                                .toList()
                        : List.of()
        );
        return dto;
    }

    @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
    @GetMapping
    public ResponseEntity<PageDTO<ProductoResponseDTO>> getAllProductos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("nombre"));
        Page<Producto> productosPage = productoRepository.findAll(pageable);
        Page<ProductoResponseDTO> dtos = productosPage.map(this::toDto);
        PageDTO<ProductoResponseDTO> dto = new PageDTO<>(
                dtos.getContent(),
                dtos.getNumber(),
                dtos.getTotalPages(),
                dtos.getTotalElements()
        );
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crearProductoConFoto(
            @RequestPart("producto") String productoJson,
            @RequestPart("foto") MultipartFile foto
    ) {
        ProductoCreateDTO dto;
        try {
            dto = objectMapper.readValue(productoJson, ProductoCreateDTO.class);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", "JSON mal formado: " + ex.getMessage()));
        }

        BindingResult result = new BeanPropertyBindingResult(dto, "productoCreateDTO");
        Set<ConstraintViolation<ProductoCreateDTO>> violations = validator.validate(dto);
        for (ConstraintViolation<ProductoCreateDTO> violation : violations) {
            result.addError(new FieldError("productoCreateDTO", violation.getPropertyPath().toString(), violation.getMessage()));
        }

        if (foto == null || foto.isEmpty()) {
            result.addError(new FieldError("productoCreateDTO", "foto", "La foto no puede estar vacía"));
        }

        if (result.hasErrors()) {
            Map<String, String> errores = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errores.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errores);
        }

        Optional<Pais> paisOptional = paisRepository.findById(dto.getPaisId());
        if (paisOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("paisId", "País no encontrado"));
        }

        List<Categoria> categorias = categoriaRepository.findAllById(dto.getCategoriaIds());
        List<Long> categoriasEncontradas = categorias.stream().map(Categoria::getId).toList();
        List<Long> categoriasNoEncontradas = new ArrayList<>(dto.getCategoriaIds());
        categoriasNoEncontradas.removeAll(categoriasEncontradas);
        if (!categoriasNoEncontradas.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("categoriaIds", "No se encontraron las siguientes categorías: " + categoriasNoEncontradas));
        }

        try {
            fotoProductoService.validarArchivo(foto);
            String fotoNombre = fotoProductoService.generarNombreUnico(foto);
            fotoProductoService.guardarImagen(foto, fotoNombre, "productos");

            Producto producto = Producto.builder()
                    .nombre(dto.getNombre())
                    .precio(dto.getPrecio())
                    .pais(paisOptional.get())
                    .iva(dto.getIva())
                    .foto(fotoNombre)
                    .build();

            List<ProductoCategoria> relaciones = categorias.stream()
                    .map(cat -> ProductoCategoria.builder()
                            .producto(producto)
                            .categoria(cat)
                            .id(new ProductoCategoriaId())
                            .build())
                    .toList();

            producto.setCategorias(relaciones);
            Producto guardado = productoRepository.save(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(toDto(guardado));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> editarProducto(
            @PathVariable Long id,
            @RequestPart("producto") String productoJson,
            @RequestPart(value = "foto", required = false) MultipartFile foto
    ) {
        ProductoUpdateDTO dto;
        try {
            dto = objectMapper.readValue(productoJson, ProductoUpdateDTO.class);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", "JSON mal formado: " + ex.getMessage()));
        }

        Set<ConstraintViolation<ProductoUpdateDTO>> violations = validator.validate(dto);
        if (!violations.isEmpty()) {
            Map<String, String> errores = new HashMap<>();
            for (ConstraintViolation<ProductoUpdateDTO> violation : violations) {
                errores.put(violation.getPropertyPath().toString(), violation.getMessage());
            }
            return ResponseEntity.badRequest().body(errores);
        }

        Optional<Producto> productoOptional = productoRepository.findById(id);
        if (productoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Producto no encontrado"));
        }

        Optional<Pais> paisOptional = paisRepository.findById(dto.getPaisId());
        if (paisOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("paisId", "País no encontrado"));
        }

        List<Categoria> categorias = categoriaRepository.findAllById(dto.getCategoriaIds());
        List<Long> categoriasEncontradas = categorias.stream().map(Categoria::getId).toList();
        List<Long> categoriasNoEncontradas = new ArrayList<>(dto.getCategoriaIds());
        categoriasNoEncontradas.removeAll(categoriasEncontradas);
        if (!categoriasNoEncontradas.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("categoriaIds", "No se encontraron las siguientes categorías: " + categoriasNoEncontradas));
        }

        try {
            Producto producto = productoOptional.get();
            producto.setNombre(dto.getNombre());
            producto.setPrecio(dto.getPrecio());
            producto.setIva(dto.getIva());
            producto.setPais(paisOptional.get());

            producto.getCategorias().clear();
            List<ProductoCategoria> nuevasRelaciones = new ArrayList<>();
            for (Categoria cat : categorias) {
                ProductoCategoria relacion = ProductoCategoria.builder()
                        .producto(producto)
                        .categoria(cat)
                        .id(new ProductoCategoriaId(producto.getId(), cat.getId()))
                        .build();
                nuevasRelaciones.add(relacion);
            }
            producto.getCategorias().addAll(nuevasRelaciones);

            if (foto != null && !foto.isEmpty()) {
                // 🧹 Eliminar la imagen anterior si ya existía
                if (producto.getFoto() != null && !producto.getFoto().isBlank()) {
                    fotoProductoService.eliminarImagen(producto.getFoto(), "productos");
                }

                fotoProductoService.validarArchivo(foto);
                String fotoNombre = fotoProductoService.generarNombreUnico(foto);
                fotoProductoService.guardarImagen(foto, fotoNombre, "productos");
                producto.setFoto(fotoNombre);
            }

            Producto guardado = productoRepository.save(producto);
            return ResponseEntity.ok(toDto(guardado));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage(), "exception", e.toString()));
        }
    }


    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProducto(@PathVariable Long id) {
        Optional<Producto> productoOptional = productoRepository.findById(id);
        if (productoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Producto no encontrado"));
        }
        Producto producto = productoOptional.get();

        boolean enVenta = ventaProductosRepository.existsByProducto_Id(id);
        if (enVenta) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "No se puede eliminar el producto porque ya ha sido vendido.", "razon", "EN_VENTA"));
        }

        if (producto.getFoto() != null && !producto.getFoto().isBlank()) {
            fotoProductoService.eliminarImagen(producto.getFoto(), "productos");
        }

        productoRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Producto eliminado"));
    }


}
