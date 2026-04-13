package ies.juanbosoco.locuventas_backend.controllers.docs;

import ies.juanbosoco.locuventas_backend.common.ApiResponseDTO;
import ies.juanbosoco.locuventas_backend.entities.Pais;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@Tag(name = "Países", description = "Endpoints para la consulta de países de origen")
public interface PaisApi {

    @Operation(
            summary = "Obtener listado de países",
            description = "Devuelve todos los países disponibles. Acceso para ADMIN y VENDEDOR.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de países obtenida correctamente"),
                    @ApiResponse(responseCode = "401", description = "No autenticado"),
                    @ApiResponse(responseCode = "403", description = "Rol insuficiente")
            }
    )
    @GetMapping
    ResponseEntity<ApiResponseDTO<List<Pais>>> getAllPaises();
}