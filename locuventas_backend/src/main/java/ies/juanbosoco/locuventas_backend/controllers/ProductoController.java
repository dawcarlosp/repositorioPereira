package ies.juanbosoco.locuventas_backend.controllers;

import ies.juanbosoco.locuventas_backend.entities.Categoria;
import ies.juanbosoco.locuventas_backend.entities.Producto;
import ies.juanbosoco.locuventas_backend.repositories.ProductoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("productos")
public class ProductoController {
    @Autowired
    private ProductoRepository productoRepository;
    /* Crear un nuevo producto */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> storeProducto(@RequestBody @Valid Producto producto, BindingResult result){
        if(result.hasErrors()){
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }
        Producto nuevoProducto  = this.productoRepository.save(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
    }
}
