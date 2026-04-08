package ies.juanbosoco.locuventas_backend.services;

import ies.juanbosoco.locuventas_backend.services.utils.FileNameGenerator;
import ies.juanbosoco.locuventas_backend.services.validation.FileValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;

@Service
public class FotoService {

    private static final Logger logger = LoggerFactory.getLogger(FotoService.class);
    private static final Path BASE_UPLOADS_PATH = Paths.get("uploads").toAbsolutePath();

    private final ImageService imageService;
    private final FileNameGenerator fileNameGenerator;
    private final FileValidator fileValidator;

    public FotoService(ImageService imageService,
                       FileNameGenerator fileNameGenerator,
                       FileValidator fileValidator) {
        this.imageService = imageService;
        this.fileNameGenerator = fileNameGenerator;
        this.fileValidator = fileValidator;
    }
    public void guardarFotoProducto(MultipartFile archivo, String nombreArchivo) {
        guardarFoto(archivo, "productos", nombreArchivo);
    }

    public void guardarFotoVendedor(MultipartFile archivo, String nombreArchivo) {
        guardarFoto(archivo, "vendedores", nombreArchivo);
    }

    // MÉTODO DE ALTO NIVEL (el que usarán otros métodos)
    public void guardarFoto(MultipartFile archivo, String subdirectorio, String nombreArchivo) {

        //Guardar físicamente
        guardarEnDisco(archivo, nombreArchivo, subdirectorio);
    }

    public void eliminarImagen(String nombreArchivo, String subdirectorio) {
        if (nombreArchivo == null || nombreArchivo.isBlank()) {
            logger.warn("No se proporcionó nombre de archivo para eliminar.");
            return;
        }

        Path rutaArchivo = construirRuta(nombreArchivo, subdirectorio);

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

    // =====================
    // MÉTODOS PRIVADOS
    // =====================

    private void guardarEnDisco(MultipartFile archivo, String nombreArchivo, String subdirectorio) {
        Path directorioPath = construirDirectorio(subdirectorio);

        try {
            Files.createDirectories(directorioPath);
        } catch (IOException e) {
            throw new RuntimeException("Error al crear el directorio: " + directorioPath, e);
        }

        Path rutaDestino = directorioPath.resolve(nombreArchivo);

        try {
            byte[] contenido = archivo.getBytes();
            String extension = fileNameGenerator.obtenerExtensionArchivo(nombreArchivo).substring(1);

            if (extension.equals("jfif") || extension.equals("jpeg")) {
                extension = "jpg";
            }

            byte[] contenidoRedimensionado =
                    imageService.resizeImage(contenido, 1000, extension);

            Files.write(rutaDestino, contenidoRedimensionado);

            logger.info("Imagen guardada en: {}", rutaDestino);

        } catch (IOException e) {
            logger.error("Error detallado al guardar archivo: ", e);
            throw new RuntimeException("Error al guardar archivo: " + archivo.getOriginalFilename(), e);
        }
    }

    private Path construirDirectorio(String subdirectorio) {
        return (subdirectorio != null && !subdirectorio.isBlank())
                ? BASE_UPLOADS_PATH.resolve(subdirectorio)
                : BASE_UPLOADS_PATH;
    }

    private Path construirRuta(String nombreArchivo, String subdirectorio) {
        return construirDirectorio(subdirectorio).resolve(nombreArchivo);
    }
    public String prepararNombre(MultipartFile archivo) {
        // Validar que haya foto
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("Debes seleccionar una foto.");
        }
        fileValidator.validarArchivo(archivo);
        return fileNameGenerator.generarNombreUnico(archivo);
    }
}