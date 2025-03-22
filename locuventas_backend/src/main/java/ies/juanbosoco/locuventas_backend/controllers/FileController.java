package ies.juanbosoco.locuventas_backend.controllers;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
@RestController
@RequestMapping("/uploads/imagesVendedores")
public class FileController {
    private final String uploadDir = "uploads/imagesVendedores"; // Ruta donde están las imágenes

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws Exception {
        //String username = authentication.getName(); // Obtiene el nombre del usuario autenticado

        // (Opcional) Validar que el usuario solo acceda a su propia imagen
        /*
        if (!filename.startsWith(username)) {
            return ResponseEntity.status(403).build(); // Prohibido si no es su imagen
        }
*/
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "image/jpeg")
                .body(resource);
    }
}
