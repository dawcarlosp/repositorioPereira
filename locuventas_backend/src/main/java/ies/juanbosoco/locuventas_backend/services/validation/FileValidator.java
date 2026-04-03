package ies.juanbosoco.locuventas_backend.services.validation;

import ies.juanbosoco.locuventas_backend.services.FotoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Component
public class FileValidator {
    private static final Logger logger = LoggerFactory.getLogger(FotoService.class);
    private static final List<String> TIPOS_PERMITIDOS = List.of("image/jpeg", "image/png", "image/gif", "image/avif", "image/webp", "image/jpg");
    private static final long MAX_FILE_SIZE = 10_000_000;
    private static final Path BASE_UPLOADS_PATH = Paths.get("uploads").toAbsolutePath();

    public void validarArchivo(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("El archivo no ha sido seleccionado o está vacío.");
        }
        if (!TIPOS_PERMITIDOS.contains(archivo.getContentType())) {
            throw new IllegalArgumentException("El tipo de archivo no es permitido: " + archivo.getContentType());
        }
        if (archivo.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("El archivo es demasiado grande. Máximo permitido: 10 MB.");
        }
    }
}
