package ies.juanbosoco.locuventas_backend.services;

import ies.juanbosoco.locuventas_backend.services.utils.FileNameGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Service
public class FotoService {

    private static final Logger logger = LoggerFactory.getLogger(FotoService.class);
    private static final List<String> TIPOS_PERMITIDOS = List.of("image/jpeg", "image/png", "image/gif", "image/avif", "image/webp", "image/jpg");
    private static final long MAX_FILE_SIZE = 10_000_000;
    private static final Path BASE_UPLOADS_PATH = Paths.get("uploads").toAbsolutePath();

    @Autowired
    private ImageService imageService;
    @Autowired
    private FileNameGenerator fileNameGenerator;

    public void guardarImagen(MultipartFile archivo, String nuevoNombreFoto, String subdirectorio) {
        Path directorioPath = (subdirectorio != null && !subdirectorio.isBlank())
                ? BASE_UPLOADS_PATH.resolve(subdirectorio)
                : BASE_UPLOADS_PATH;

        try {
            Files.createDirectories(directorioPath);
        } catch (IOException e) {
            throw new RuntimeException("Error al crear el directorio de subidas: " + directorioPath, e);
        }

        Path rutaDestino = directorioPath.resolve(nuevoNombreFoto);

        try {
            byte[] contenido = archivo.getBytes();
            String extension = fileNameGenerator.obtenerExtensionArchivo(nuevoNombreFoto).substring(1); // sin el punto
            byte[] contenidoRedimensionado = imageService.resizeImage(contenido, 1000, extension);
            Files.write(rutaDestino, contenidoRedimensionado);
            logger.info("Imagen guardada exitosamente en: {}", rutaDestino);
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo: " + archivo.getOriginalFilename(), e);
        }
    }

    public void eliminarImagen(String nombreArchivo, String subdirectorio) {
        if (nombreArchivo == null || nombreArchivo.isBlank()) {
            logger.warn("No se proporcionó nombre de archivo para eliminar.");
            return;
        }

        Path directorioPath = (subdirectorio != null && !subdirectorio.isBlank())
                ? BASE_UPLOADS_PATH.resolve(subdirectorio)
                : BASE_UPLOADS_PATH;

        Path rutaArchivo = directorioPath.resolve(nombreArchivo);

        try {
            if (Files.exists(rutaArchivo)) {
                Files.delete(rutaArchivo);
                logger.info("Imagen eliminada exitosamente: {}", rutaArchivo);
            } else {
                logger.warn("La imagen a eliminar no existe: {}", rutaArchivo);
            }
        } catch (IOException e) {
            logger.error("Error al eliminar la imagen: {}", rutaArchivo, e);
            throw new RuntimeException("Error al eliminar la imagen: " + nombreArchivo, e);
        }
    }
}
