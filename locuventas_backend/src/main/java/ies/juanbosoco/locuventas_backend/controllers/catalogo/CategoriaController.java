package ies.juanbosoco.locuventas_backend.controllers.catalogo;

import ies.juanbosoco.locuventas_backend.DTO.catalogo.CategoriaCreateDTO;
import ies.juanbosoco.locuventas_backend.DTO.catalogo.CategoriaResponseDTO;
import ies.juanbosoco.locuventas_backend.DTO.common.ApiResponseDTO;
import ies.juanbosoco.locuventas_backend.controllers.docs.CategoriaApi;
import ies.juanbosoco.locuventas_backend.services.catalogo.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/categorias")
@RequiredArgsConstructor
public class CategoriaController implements CategoriaApi {

    private final CategoriaService categoriaService;

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<ApiResponseDTO<List<CategoriaResponseDTO>>> getAllCategorias() {
        List<CategoriaResponseDTO> data = categoriaService.findAll();
        return ApiResponseDTO.success("Categorías recuperadas correctamente", data, HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<CategoriaResponseDTO>> createCategoria(@Valid @RequestBody CategoriaCreateDTO dto) {
        CategoriaResponseDTO data = categoriaService.create(dto);
        return ApiResponseDTO.success("Categoría creada correctamente", data, HttpStatus.CREATED);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<CategoriaResponseDTO>> updateCategoria(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaCreateDTO dto
    ) {
        CategoriaResponseDTO data = categoriaService.update(id, dto);
        return ApiResponseDTO.success("Categoría actualizada correctamente", data, HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<Integer>> deleteCategoria(@PathVariable Long id) {
        int productCount = categoriaService.delete(id);
        if (productCount > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ApiResponseDTO.<Integer>builder()
                            .message("La categoría tiene " + productCount + " productos asociados")
                            .data(productCount)
                            .status(HttpStatus.CONFLICT.value())
                            .timestamp(LocalDateTime.now())
                            .build()
            );
        }
        return ApiResponseDTO.success("Categoría eliminada correctamente", 0, HttpStatus.OK);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<Void>> deleteCategoriaWithProducts(@PathVariable Long id) {
        categoriaService.deleteWithProducts(id);
        return ApiResponseDTO.success("Categoría y productos asociados eliminados correctamente", null, HttpStatus.OK);
    }
}
