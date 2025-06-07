package ies.juanbosoco.locuventas_backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class FotoService {

    private static final Logger logger = LoggerFactory.getLogger(FotoService.class);
    private static final List<String> TIPOS_PERMITIDOS = List.of("image/jpeg", "image/png", "image/gif", "image/avif", "image/webp", "image/jpg");
    private static final long MAX_FILE_SIZE = 10_000_000;  // 10 MB
    private static final String UPLOADS_DIRECTORY = "uploads/";

    @Autowired
    private ImageService imageService;

    // Validar que el archivo cumpla las restricciones
    public void validarArchivo(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("El archivo no ha sido seleccionado o está vacío.");
        }

        if (!esTipoPermitido(archivo)) {
            throw new IllegalArgumentException("El tipo de archivo no es permitido: " + archivo.getContentType());
        }

        if (!esTamañoPermitido(archivo)) {
            throw new IllegalArgumentException("El archivo es demasiado grande. Solo se permiten archivos de hasta 10 MB.");
        }
    }

    private boolean esTipoPermitido(MultipartFile archivo) {
        return TIPOS_PERMITIDOS.contains(archivo.getContentType());
    }

    private boolean esTamañoPermitido(MultipartFile archivo) {
        return archivo.getSize() <= MAX_FILE_SIZE;
    }

    public String generarNombreUnico(MultipartFile archivo) {
        if (archivo.getOriginalFilename() == null || archivo.getOriginalFilename().isEmpty()) {
            throw new IllegalArgumentException("El archivo seleccionado no tiene un nombre válido.");
        }

        String extension = obtenerExtensionArchivo(archivo.getOriginalFilename());
        UUID nombreUnico = UUID.randomUUID();
        return nombreUnico.toString() + extension;
    }

    private String obtenerExtensionArchivo(String nombreArchivo) {
        int index = nombreArchivo.lastIndexOf('.');
        if (index == -1) {
            throw new IllegalArgumentException("El archivo seleccionado no tiene una extensión válida.");
        }
        return nombreArchivo.substring(index);
    }

    // ============ NUEVO: Permite elegir subdirectorio ("productos", "vendedores", etc) ================
    public void guardarImagen(MultipartFile archivo, String nuevoNombreFoto, String subdirectorio) {
        String destinoDir = UPLOADS_DIRECTORY + (subdirectorio != null && !subdirectorio.isBlank() ? subdirectorio + "/" : "");
        Path directorioPath = Paths.get(destinoDir);

        try {
            if (Files.notExists(directorioPath)) {
                Files.createDirectories(directorioPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Error al crear el directorio de subidas: " + destinoDir, e);
        }

        Path ruta = directorioPath.resolve(nuevoNombreFoto);

        try {
            byte[] contenido = archivo.getBytes();
            byte[] contenidoRedimensionado = imageService.resizeImage(contenido, 1000);
            Files.write(ruta, contenidoRedimensionado);
            logger.info("Imagen guardada exitosamente en: " + ruta.toString());
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo: " + archivo.getOriginalFilename(), e);
        }
    }

    // ============ Retrocompatibilidad: sube directo a uploads/ como antes ===========
    public void guardarImagen(MultipartFile archivo, String nuevoNombreFoto) {
        guardarImagen(archivo, nuevoNombreFoto, null);
    }

    // ==================== ELIMINAR IMAGEN de subdirectorio =======================
    public void eliminarImagen(String nombreArchivo, String subdirectorio) {
        if (nombreArchivo == null || nombreArchivo.isBlank()) {
            logger.warn("No se proporcionó nombre de archivo para eliminar.");
            return;
        }
        String destinoDir = UPLOADS_DIRECTORY + (subdirectorio != null && !subdirectorio.isBlank() ? subdirectorio + "/" : "");
        Path ruta = Paths.get(destinoDir + nombreArchivo);

        try {
            if (Files.exists(ruta)) {
                Files.delete(ruta);
                logger.info("Imagen eliminada exitosamente: " + ruta.toString());
            } else {
                logger.warn("La imagen a eliminar no existe: " + ruta.toString());
            }
        } catch (IOException e) {
            logger.error("Error al eliminar la imagen: " + ruta.toString(), e);
            throw new RuntimeException("Error al eliminar la imagen: " + nombreArchivo, e);
        }
    }

    // =========== Retrocompatibilidad: elimina directo en uploads/ ============
    public void eliminarImagen(String nombreArchivo) {
        eliminarImagen(nombreArchivo, null);
    }
}
