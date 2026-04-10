package ies.juanbosoco.locuventas_backend.controllers.docs;

import ies.juanbosoco.locuventas_backend.common.ApiResponseDTO;
import ies.juanbosoco.locuventas_backend.DTO.common.PageDTO;
import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Productos", description = "Endpoints para la gestión y consulta de productos")
public interface ProductoApi {

    @Operation(
            summary = "Listar productos de forma paginada",
            description = "Devuelve una página de productos con información detallada como precio, IVA, país de origen y categorías. Acceso permitido para ADMIN y VENDEDOR.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista paginada recuperada con éxito"),
                    @ApiResponse(responseCode = "401", description = "No autorizado - Token faltante o inválido"),
                    @ApiResponse(responseCode = "403", description = "Prohibido - No tienes los roles necesarios")
            }
    )
    @GetMapping
    ResponseEntity<ApiResponseDTO<PageDTO<ProductoResponseDTO>>> getAllProductos(
            @Parameter(description = "Número de página (empieza en 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Cantidad de elementos por página", example = "12")
            @RequestParam(defaultValue = "12") int size
    );
}