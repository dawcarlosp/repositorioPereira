package ies.juanbosoco.locuventas_backend.controllers;

import ies.juanbosoco.locuventas_backend.dtos.ProductoCreateDTO;
import ies.juanbosoco.locuventas_backend.entities.Categoria;
import ies.juanbosoco.locuventas_backend.entities.Pais;
import ies.juanbosoco.locuventas_backend.entities.Producto;
import ies.juanbosoco.locuventas_backend.repositories.CategoriaRepository;
import ies.juanbosoco.locuventas_backend.repositories.PaisRepository;
import ies.juanbosoco.locuventas_backend.repositories.ProductoRepository;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.*;
@RestController
@RequestMapping("productos")
public class ProductoController {
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private PaisRepository paisRepository;
    @Autowired
    private CategoriaRepository categoriaRepository;
    @Autowired
    private FotoService fotoProductoService;
    /* Crear un nuevo producto */
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crearProductoConFoto(
            @Valid @RequestPart("producto") ProductoCreateDTO dto,
            @RequestPart("foto") MultipartFile foto,
            BindingResult result) {

        if (foto.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "La foto no puede estar vacía"));
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
        if (categorias.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("categoriaIds", "No se encontraron categorías válidas"));
        }

        try {
            // Guardar la imagen
            fotoProductoService.validarArchivo(foto);
            String fotoNombre = fotoProductoService.generarNombreUnico(foto);
            fotoProductoService.guardarImagen(foto, fotoNombre);

            // Construir producto base
            Producto producto = Producto.builder()
                    .nombre(dto.getNombre())
                    .precio(dto.getPrecio())
                    .pais(paisOptional.get())
                    .foto(fotoNombre)
                    .build();

            // Asociar categorías
            List<ProductoCategoria> relaciones = categorias.stream()
                    .map(cat -> ProductoCategoria.builder()
                            .producto(producto)
                            .categoria(cat)
                            .id(new ProductoCategoriaId()) // se usa @MapsId
                            .build())
                    .toList();

            producto.setCategorias(relaciones);

            Producto guardado = productoRepository.save(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    @GetMapping("/categoria/{id}")
    @PreAuthorize("hasAnyRole('VENDEDOR', 'ADMIN')")
    public ResponseEntity<List<Producto>> getProductosPorCategoria(@PathVariable Long id) {
    List<Producto> productos = productoRepository.findByCategorias_Categoria_Id(id);

    if (productos.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
    }

    return ResponseEntity.ok(productos);
    }

    @GetMapping("/pais/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
    public ResponseEntity<List<Producto>> productosPorPais(@PathVariable Long id) {
    List<Producto> productos = productoRepository.findByPais_Id(id);
    return ResponseEntity.ok(productos);
    }

    @GetMapping("/buscar")
    @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
    public ResponseEntity<List<Producto>> buscarPorNombre(@RequestParam String nombre) {
    List<Producto> resultados = productoRepository.findByNombreContainingIgnoreCase(nombre);
    return ResponseEntity.ok(resultados);
}


}
