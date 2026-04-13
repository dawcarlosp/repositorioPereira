package ies.juanbosoco.locuventas_backend.controllers.docs;

import ies.juanbosoco.locuventas_backend.common.ApiResponseDTO;
import ies.juanbosoco.locuventas_backend.entities.Categoria;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

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
    ResponseEntity<ApiResponseDTO<List<Categoria>>> getAllCategorias();
}