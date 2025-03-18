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
public class FotoVendedorService {

    private static final Logger logger = LoggerFactory.getLogger(FotoVendedorService.class);
    private static final List<String> TIPOS_PERMITIDOS = List.of("image/jpeg", "image/png", "image/gif", "image/avif", "image/webp", "image/jpg");
    private static final long MAX_FILE_SIZE = 10_000_000;  // 10 MB
    private static final String UPLOADS_DIRECTORY = "uploads/imagesVendedores/";

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

    // Validación del tipo de archivo permitido
    private boolean esTipoPermitido(MultipartFile archivo) {
        return TIPOS_PERMITIDOS.contains(archivo.getContentType());
    }

    // Validación del tamaño del archivo
    private boolean esTamañoPermitido(MultipartFile archivo) {
        return archivo.getSize() <= MAX_FILE_SIZE;
    }

    // Generar un nombre único para el archivo con su extensión
    public String generarNombreUnico(MultipartFile archivo) {
        if (archivo.getOriginalFilename() == null || archivo.getOriginalFilename().isEmpty()) {
            throw new IllegalArgumentException("El archivo seleccionado no tiene un nombre válido.");
        }

        String extension = obtenerExtensionArchivo(archivo.getOriginalFilename());
        UUID nombreUnico = UUID.randomUUID();
        return nombreUnico.toString() + extension;
    }

    // Extraer la extensión del archivo
    private String obtenerExtensionArchivo(String nombreArchivo) {
        int index = nombreArchivo.lastIndexOf('.');
        if (index == -1) {
            throw new IllegalArgumentException("El archivo seleccionado no tiene una extensión válida.");
        }
        return nombreArchivo.substring(index);
    }

    // Guardar la imagen en el sistema de archivos
    public void guardarImagen(MultipartFile archivo, String nuevoNombreFoto) {
        Path directorioPath = Paths.get(UPLOADS_DIRECTORY);

        // Asegurar que el directorio de subida exista
        try {
            if (Files.notExists(directorioPath)) {
                Files.createDirectories(directorioPath);  // Crea el directorio si no existe
            }
        } catch (IOException e) {
            throw new RuntimeException("Error al crear el directorio de subidas: " + UPLOADS_DIRECTORY, e);
        }

        Path rutaArchivo = directorioPath.resolve(nuevoNombreFoto);

        // Guardar la imagen redimensionada
        try {
            byte[] contenido = archivo.getBytes();
            byte[] contenidoRedimensionado = imageService.resizeImage(contenido, 1000); // Redimensionamos a un tamaño específico
            Files.write(rutaArchivo, contenidoRedimensionado);
            logger.info("Imagen guardada exitosamente en: " + rutaArchivo.toString());
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo: " + archivo.getOriginalFilename(), e);
        }
    }
}
