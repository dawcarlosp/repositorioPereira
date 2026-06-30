package ies.juanbosoco.locuventas_backend.controllers.docs;

import ies.juanbosoco.locuventas_backend.DTO.catalogo.CategoriaCreateDTO;
import ies.juanbosoco.locuventas_backend.DTO.catalogo.CategoriaResponseDTO;
import ies.juanbosoco.locuventas_backend.DTO.common.ApiResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Categorías", description = "Endpoints para la gestión y consulta de categorías de productos")
public interface CategoriaApi {

    @Operation(
            summary = "Obtener todas las categorías",
            description = "Devuelve una lista completa de las categorías. Acceso permitido para ADMIN y VENDEDOR.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista recuperada con éxito"),
                    @ApiResponse(responseCode = "401", description = "No autorizado"),
                    @ApiResponse(responseCode = "403", description = "Prohibido - Roles insuficientes")
            }
    )
    @GetMapping
    ResponseEntity<ApiResponseDTO<List<CategoriaResponseDTO>>> getAllCategorias();

    @Operation(
            summary = "Crear una categoría",
            description = "Crea una nueva categoría. Solo ADMIN.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "201", description = "Categoría creada"),
                    @ApiResponse(responseCode = "409", description = "Conflicto - ya existe una categoría con ese nombre")
            }
    )
    @PostMapping
    ResponseEntity<ApiResponseDTO<CategoriaResponseDTO>> createCategoria(@Valid @RequestBody CategoriaCreateDTO dto);

    @Operation(
            summary = "Actualizar una categoría",
            description = "Actualiza el nombre de una categoría existente. Solo ADMIN.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Categoría actualizada"),
                    @ApiResponse(responseCode = "404", description = "Categoría no encontrada"),
                    @ApiResponse(responseCode = "409", description = "Conflicto - ya existe otra categoría con ese nombre")
            }
    )
    @PutMapping("/{id}")
    ResponseEntity<ApiResponseDTO<CategoriaResponseDTO>> updateCategoria(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaCreateDTO dto
    );

    @Operation(
            summary = "Eliminar una categoría",
            description = "Elimina una categoría solo si no tiene productos asociados. Si tiene productos, devuelve 409 con el número de productos. Solo ADMIN.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Categoría eliminada"),
                    @ApiResponse(responseCode = "409", description = "Conflicto - la categoría tiene productos asociados"),
                    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
            }
    )
    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponseDTO<Integer>> deleteCategoria(@PathVariable Long id);

    @Operation(
            summary = "Eliminar una categoría con todos sus productos",
            description = "Elimina la categoría y todos los productos asociados (que no tengan ventas registradas). Solo ADMIN.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Categoría y productos eliminados"),
                    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
            }
    )
    @DeleteMapping("/{id}/force")
    ResponseEntity<ApiResponseDTO<Void>> deleteCategoriaWithProducts(@PathVariable Long id);
}
