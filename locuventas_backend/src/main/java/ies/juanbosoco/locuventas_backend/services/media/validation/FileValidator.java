package ies.juanbosoco.locuventas_backend.services.media.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Component
public class FileValidator {
    private static final Logger logger = LoggerFactory.getLogger(FileValidator.class);
    private static final List<String> TIPOS_PERMITIDOS = List.of("image/jpeg", "image/png", "image/gif", "image/avif", "image/webp", "image/jpg", "image/jfif");
    private static final long MAX_FILE_SIZE = 10_000_000;

    public void validarArchivo(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("El archivo no ha sido seleccionado o está vacío.");
        }

        String contentType = archivo.getContentType();
        String fileName = archivo.getOriginalFilename();

        // Lógica flexible: Si es octet-stream, verificamos la extensión
        boolean esTipoValido = TIPOS_PERMITIDOS.contains(contentType);

        if (!esTipoValido && "application/octet-stream".equals(contentType) && fileName != null) {
            String extension = fileName.toLowerCase();
            if (extension.endsWith(".webp") || extension.endsWith(".jpg") ||
                    extension.endsWith(".jpeg") || extension.endsWith(".png")) {
                esTipoValido = true;
            }
        }

        if (!esTipoValido) {
            throw new IllegalArgumentException("El tipo de archivo no es permitido: " + contentType);
        }

        if (archivo.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("El archivo es demasiado grande. Máximo permitido: 10 MB.");
        }
    }
}
