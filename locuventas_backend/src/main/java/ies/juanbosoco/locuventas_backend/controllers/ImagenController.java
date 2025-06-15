package ies.juanbosoco.locuventas_backend.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Value; // Add this import
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/imagenes")
public class ImagenController {

    private static final Logger logger = LoggerFactory.getLogger(ImagenController.class);

    @Value("${spring.web.resources.static-locations}")
    private String baseUploadDirProperty;
    @Operation(
            summary = "Obtener una imagen por tipo y nombre",
            description = "Devuelve una imagen almacenada en el servidor. Solo permite acceder a carpetas seguras: `vendedores`, `productos`, `productosprecargados`."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Imagen servida correctamente",
                    content = @Content(mediaType = "image/jpeg")),
            @ApiResponse(responseCode = "400", description = "Tipo de imagen no permitido"),
            @ApiResponse(responseCode = "404", description = "Imagen no encontrada"),
            @ApiResponse(responseCode = "500", description = "Error al intentar acceder a la imagen")
    })
    @GetMapping("/{tipo}/{filename:.+}")
    public ResponseEntity<Resource> serveImage(
            @PathVariable String tipo,
            @PathVariable String filename
    ) {
        try {
            // Normalizar tipo (evitar acceso fuera de carpeta)
            if (!tipo.equals("vendedores") && !tipo.equals("productos") && !tipo.equals("productosprecargados")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(null);
            }

            // Strip "file:" prefix if present from the injected property
            String actualBaseDir = baseUploadDirProperty.replace("file:", "");
            Path filePath = Paths.get(actualBaseDir, tipo).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            // Add logging to debug path resolution
            logger.info("Attempting to serve image from base: " + actualBaseDir + ", type: " + tipo + ", filename: " + filename);
            logger.info("Constructed filePath: " + filePath.toAbsolutePath().toString());
            logger.info("Resource exists: " + resource.exists());
            logger.info("Resource is readable: " + resource.isReadable());


            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (IOException e) {
            logger.error("Error serving image: " + e.getMessage(), e); // Log the error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}