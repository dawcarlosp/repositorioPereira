package ies.juanbosoco.locuventas_backend.controllers;

import ies.juanbosoco.locuventas_backend.controllers.docs.ImagenApi;
import ies.juanbosoco.locuventas_backend.services.FotoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class ImagenController implements ImagenApi {
    private final FotoService fotoService;

    @Override
    public ResponseEntity<Resource> serveImage(String tipo, String filename) {
        Resource resource = fotoService.cargarImagen(tipo, filename);

        try {
            // Determinar el tipo de contenido dinámicamente
            String contentType = Files.probeContentType(resource.getFile().toPath());
            if (contentType == null) contentType = "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}