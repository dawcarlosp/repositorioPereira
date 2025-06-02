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

    /* Crear un nuevo producto */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> storeProducto(@RequestBody @Valid ProductoCreateDTO producto, BindingResult result){
         if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }

        Optional<Pais> paisOptional = paisRepository.findById(dto.getPaisId());
        if (paisOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("paisId", "País no encontrado"));
        }

        List<Categoria> categorias = categoriaRepository.findAllById(dto.getCategoriaIds());
        if (categorias.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("categoriaIds", "No se encontraron categorías válidas"));
        }

        Producto producto = Producto.builder()
                .nombre(dto.getNombre())
                .precio(dto.getPrecio())
                .pais(paisOptional.get())
                .categorias(new HashSet<>(categorias))
                .build();

        Producto nuevoProducto = productoRepository.save(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
    }
}
