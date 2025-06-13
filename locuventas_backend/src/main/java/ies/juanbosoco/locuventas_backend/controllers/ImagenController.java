package ies.juanbosoco.locuventas_backend.controllers;

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

@RestController
@RequestMapping("/imagenes")
public class ImagenController {

    private static final String BASE_UPLOAD_DIR = "uploads";

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

            Path filePath = Paths.get(BASE_UPLOAD_DIR, tipo).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
