package ies.juanbosoco.locuventas_backend.controllers;
import com.fasterxml.jackson.databind.ObjectMapper;
import ies.juanbosoco.locuventas_backend.DTO.common.PageDTO;
import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoCreateDTO;
import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoResponseDTO;
import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoUpdateDTO;
import ies.juanbosoco.locuventas_backend.common.ApiResponseDTO;
import ies.juanbosoco.locuventas_backend.controllers.docs.ProductoApi;
import ies.juanbosoco.locuventas_backend.entities.*;
import ies.juanbosoco.locuventas_backend.repositories.CategoriaRepository;
import ies.juanbosoco.locuventas_backend.repositories.PaisRepository;
import ies.juanbosoco.locuventas_backend.repositories.ProductoRepository;
import ies.juanbosoco.locuventas_backend.repositories.VentaProductoRepository;
import ies.juanbosoco.locuventas_backend.services.FotoService;
import ies.juanbosoco.locuventas_backend.services.ProductoService;
import ies.juanbosoco.locuventas_backend.services.validation.FileValidator;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/productos")
public class ProductoController implements ProductoApi {
    @Autowired
    private ProductoService productoService;

    @Override
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
    public ResponseEntity<ApiResponseDTO<PageDTO<ProductoResponseDTO>>> getAllProductos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        PageDTO<ProductoResponseDTO> data = productoService.getAllProductos(page, size);
        return ApiResponseDTO.success("Productos recuperados correctamente", data, HttpStatus.OK);
    }

    @Override
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<ProductoResponseDTO>> crearProducto(
            @RequestPart("producto") @Valid ProductoCreateDTO dto,
            @RequestPart("foto") MultipartFile foto
    ) {
        ProductoResponseDTO nuevoProducto = productoService.crearProducto(dto, foto);
        return ApiResponseDTO.success("Producto creado correctamente", nuevoProducto, HttpStatus.CREATED);
    }

    @Override
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<ProductoResponseDTO>> editarProducto(
            @PathVariable Long id,
            @RequestPart("producto") @Valid ProductoUpdateDTO dto,
            @RequestPart(value = "foto", required = false) MultipartFile foto
    ) {
        ProductoResponseDTO actualizado = productoService.editarProducto(id, dto, foto);
        return ApiResponseDTO.success("Producto actualizado correctamente", actualizado, HttpStatus.OK);
    }

    @Override
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<Void>> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ApiResponseDTO.success("Producto eliminado correctamente", null, HttpStatus.OK);
    }

}
