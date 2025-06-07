package ies.juanbosoco.locuventas_backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import ies.juanbosoco.locuventas_backend.DTO.ProductoCreateDTO;
import ies.juanbosoco.locuventas_backend.DTO.ProductoResponseDTO;
import ies.juanbosoco.locuventas_backend.DTO.ProductoUpdateDTO;
import ies.juanbosoco.locuventas_backend.entities.*;
import ies.juanbosoco.locuventas_backend.repositories.CategoriaRepository;
import ies.juanbosoco.locuventas_backend.repositories.PaisRepository;
import ies.juanbosoco.locuventas_backend.repositories.ProductoRepository;
import ies.juanbosoco.locuventas_backend.services.FotoService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
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
@PreAuthorize("hasRole('ADMIN')")
public class ProductoController {

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

    // --- CONVERSIÓN A DTO ---
    private ProductoResponseDTO toDto(Producto producto) {
        ProductoResponseDTO dto = new ProductoResponseDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setPrecio(producto.getPrecio());
        dto.setFoto(producto.getFoto());
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

    // === LISTAR TODOS LOS PRODUCTOS ===
    @GetMapping
    public ResponseEntity<List<ProductoResponseDTO>> getAllProductos() {
        List<Producto> productos = productoRepository.findAll();
        List<ProductoResponseDTO> dtos = productos.stream().map(this::toDto).toList();
        return ResponseEntity.ok(dtos);
    }

    // === CREAR PRODUCTO ===
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

        // Validar DTO manualmente
        BindingResult result = new BeanPropertyBindingResult(dto, "productoCreateDTO");
        Set<ConstraintViolation<ProductoCreateDTO>> violations = validator.validate(dto);
        for (ConstraintViolation<ProductoCreateDTO> violation : violations) {
            String field = violation.getPropertyPath().toString();
            String message = violation.getMessage();
            result.addError(new FieldError("productoCreateDTO", field, message));
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("paisId", "País no encontrado"));
        }

        List<Categoria> categorias = categoriaRepository.findAllById(dto.getCategoriaIds());
        List<Long> categoriasEncontradas = categorias.stream().map(Categoria::getId).toList();
        List<Long> categoriasNoEncontradas = new ArrayList<>(dto.getCategoriaIds());
        categoriasNoEncontradas.removeAll(categoriasEncontradas);
        if (!categoriasNoEncontradas.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("categoriaIds", "No se encontraron las siguientes categorías: " + categoriasNoEncontradas));
        }

        try {
            // Guardar la imagen
            fotoProductoService.validarArchivo(foto);
            String fotoNombre = fotoProductoService.generarNombreUnico(foto);
            fotoProductoService.guardarImagen(foto, fotoNombre, "productos");

            // Construir producto base
            Producto producto = Producto.builder()
                    .nombre(dto.getNombre())
                    .precio(dto.getPrecio())
                    .pais(paisOptional.get())
                    .foto(fotoNombre)
                    .build();

            // Asociar categorías usando la entidad intermedia
            List<ProductoCategoria> relaciones = categorias.stream()
                    .map(cat -> ProductoCategoria.builder()
                            .producto(producto)
                            .categoria(cat)
                            .id(new ProductoCategoriaId())
                            .build())
                    .toList();

            // ¡Este punto es importante! El constructor de Producto DEBE inicializar la lista como ArrayList, o la línea siguiente lo hace:
            producto.setCategorias(relaciones);

            Producto guardado = productoRepository.save(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(toDto(guardado));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Producto no encontrado"));
        }
        Optional<Pais> paisOptional = paisRepository.findById(dto.getPaisId());
        if (paisOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("paisId", "País no encontrado"));
        }
        List<Categoria> categorias = categoriaRepository.findAllById(dto.getCategoriaIds());
        List<Long> categoriasEncontradas = categorias.stream().map(Categoria::getId).toList();
        List<Long> categoriasNoEncontradas = new ArrayList<>(dto.getCategoriaIds());
        categoriasNoEncontradas.removeAll(categoriasEncontradas);
        if (!categoriasNoEncontradas.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("categoriaIds", "No se encontraron las siguientes categorías: " + categoriasNoEncontradas));
        }

        try {
            Producto producto = productoOptional.get();
            producto.setNombre(dto.getNombre());
            producto.setPrecio(dto.getPrecio());
            producto.setPais(paisOptional.get());

            // 1. ELIMINAR RELACIONES ANTERIORES
            // Hibernate se encarga por el orphanRemoval
            producto.getCategorias().clear();

            // 2. AGREGAR NUEVAS RELACIONES (objetos frescos)
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

            // 3. FOTO (igual que antes)
            if (foto != null && !foto.isEmpty()) {
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage(), "exception", e.toString()));
        }
    }


    // === ELIMINAR PRODUCTO ===
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProducto(@PathVariable Long id) {
        Optional<Producto> producto = productoRepository.findById(id);
        if (producto.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Producto no encontrado"));
        }
        productoRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Producto eliminado"));
    }

    // === OTRAS BÚSQUEDAS / FILTROS (también devuelven DTOs) ===
    @GetMapping("/categoria/{id}")
    public ResponseEntity<List<ProductoResponseDTO>> getProductosPorCategoria(@PathVariable Long id) {
        List<Producto> productos = productoRepository.findByCategorias_Categoria_Id(id);
        List<ProductoResponseDTO> dtos = productos.stream().map(this::toDto).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/pais/{id}")
    public ResponseEntity<List<ProductoResponseDTO>> productosPorPais(@PathVariable Long id) {
        List<Producto> productos = productoRepository.findByPais_Id(id);
        List<ProductoResponseDTO> dtos = productos.stream().map(this::toDto).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProductoResponseDTO>> buscarPorNombre(@RequestParam String nombre) {
        List<Producto> resultados = productoRepository.findByNombreContainingIgnoreCase(nombre);
        List<ProductoResponseDTO> dtos = resultados.stream().map(this::toDto).toList();
        return ResponseEntity.ok(dtos);
    }
}
