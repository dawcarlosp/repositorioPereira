package ies.juanbosoco.locuventas_backend.controllers.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "Imágenes", description = "Servicio de entrega de recursos estáticos (imágenes)")
public interface ImagenApi {

    @Operation(
            summary = "Obtener una imagen",
            description = "Sirve imágenes desde carpetas seguras. **IMPORTANTE:** El parámetro 'tipo' selecciona la carpeta y 'filename' debe ser solo el nombre del archivo con su extensión, SIN carpetas adicionales.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Imagen encontrada"),
                    @ApiResponse(responseCode = "404", description = "Imagen no encontrada o ruta mal formada"),
                    @ApiResponse(responseCode = "400", description = "Tipo de carpeta no permitido")
            }
    )
    @GetMapping("/{tipo}/{filename:.+}")
    ResponseEntity<Resource> serveImage(
            @Parameter(
                    description = "Carpeta donde reside la imagen",
                    required = true,
                    schema = @Schema(allowableValues = {"vendedores", "productos", "productosprecargados"})
            )
            @PathVariable String tipo,

            @Parameter(
                    description = "Nombre exacto del archivo con extensión (ej: 'foto1.jpg'). **No incluir prefijos de carpeta.**",
                    required = true,
                    example = "uuid-de-la-imagen.jpg"
            )
            @PathVariable String filename
    );
}