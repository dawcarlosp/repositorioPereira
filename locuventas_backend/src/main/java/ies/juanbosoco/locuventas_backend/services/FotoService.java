package ies.juanbosoco.locuventas_backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class FotoService {

    private static final Logger logger = LoggerFactory.getLogger(FotoService.class);

    private static final List<String> TIPOS_PERMITIDOS = List.of(
            "image/jpeg", "image/png", "image/gif", "image/avif", "image/webp", "image/jpg"
    );

    private static final long MAX_FILE_SIZE = 10_000_000;  // 10 MB

    // Usar una ruta absoluta relativa al directorio de trabajo actual (seguro para Docker y local)
    private static final Path BASE_UPLOADS_PATH = Paths.get("uploads").toAbsolutePath();

    @Autowired
    private ImageService imageService;

    // Validación del archivo
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

    public String generarNombreUnico(MultipartFile archivo) {
        if (archivo.getOriginalFilename() == null || archivo.getOriginalFilename().isEmpty()) {
            throw new IllegalArgumentException("El archivo seleccionado no tiene un nombre válido.");
        }

        String extension = obtenerExtensionArchivo(archivo.getOriginalFilename());
        return UUID.randomUUID().toString() + extension;
    }

    private String obtenerExtensionArchivo(String nombreArchivo) {
        int index = nombreArchivo.lastIndexOf('.');
        if (index == -1) {
            throw new IllegalArgumentException("El archivo seleccionado no tiene una extensión válida.");
        }
        return nombreArchivo.substring(index);
    }

    // Guardar imagen en subdirectorio (productos, vendedores, etc.)
    public void guardarImagen(MultipartFile archivo, String nuevoNombreFoto, String subdirectorio) {
        Path directorioPath = (subdirectorio != null && !subdirectorio.isBlank())
                ? BASE_UPLOADS_PATH.resolve(subdirectorio)
                : BASE_UPLOADS_PATH;

        try {
            if (Files.notExists(directorioPath)) {
                Files.createDirectories(directorioPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Error al crear el directorio de subidas: " + directorioPath, e);
        }

        Path rutaDestino = directorioPath.resolve(nuevoNombreFoto);

        try {
            byte[] contenido = archivo.getBytes();
            byte[] contenidoRedimensionado = imageService.resizeImage(contenido, 1000);
            Files.write(rutaDestino, contenidoRedimensionado);
            logger.info("Imagen guardada exitosamente en: {}", rutaDestino.toString());
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo: " + archivo.getOriginalFilename(), e);
        }
    }

    // Retrocompatibilidad: guardar directo en uploads/
    public void guardarImagen(MultipartFile archivo, String nuevoNombreFoto) {
        guardarImagen(archivo, nuevoNombreFoto, null);
    }

    // Eliminar imagen en subdirectorio
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
                logger.info("Imagen eliminada exitosamente: {}", rutaArchivo.toString());
            } else {
                logger.warn("La imagen a eliminar no existe: {}", rutaArchivo.toString());
            }
        } catch (IOException e) {
            logger.error("Error al eliminar la imagen: {}", rutaArchivo.toString(), e);
            throw new RuntimeException("Error al eliminar la imagen: " + nombreArchivo, e);
        }
    }

    // Retrocompatibilidad: eliminar en uploads/
    public void eliminarImagen(String nombreArchivo) {
        eliminarImagen(nombreArchivo, null);
    }
}
