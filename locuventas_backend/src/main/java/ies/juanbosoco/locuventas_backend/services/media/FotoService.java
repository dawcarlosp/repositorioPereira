package ies.juanbosoco.locuventas_backend.services.media;

import ies.juanbosoco.locuventas_backend.errors.BusinessException;
import ies.juanbosoco.locuventas_backend.services.media.utils.FileNameGenerator;
import ies.juanbosoco.locuventas_backend.services.media.validation.FileValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;

@Service
public class FotoService {

    private static final Logger logger = LoggerFactory.getLogger(FotoService.class);

    // Ruta base donde se almacenan físicamente los archivos
    private final Path BASE_UPLOADS_PATH;

    private final ImageService imageService;
    private final FileNameGenerator fileNameGenerator;
    private final FileValidator fileValidator;

    /**
     * Constructor único: Inyecta servicios necesarios y la configuración de rutas de Spring.
     * Limpiamos el prefijo 'file:' de la propiedad para trabajar con Path de Java.
     */
    public FotoService(ImageService imageService,
                       FileNameGenerator fileNameGenerator,
                       FileValidator fileValidator,
                       @Value("${spring.web.resources.static-locations}") String staticLocations) {
        this.imageService = imageService;
        this.fileNameGenerator = fileNameGenerator;
        this.fileValidator = fileValidator;
        // Normalizamos la ruta eliminando el prefijo de Spring si existe
        this.BASE_UPLOADS_PATH = Paths.get(staticLocations.replace("file:", "")).toAbsolutePath().normalize();
    }

    /**
     * Sirve una imagen desde el disco. Valida que el tipo de carpeta sea seguro.
     */
    public Resource cargarImagen(String tipo, String filename) {
        try {
            // 1. Validación de carpetas permitidas (Whitelisting)
            List<String> carpetasPermitidas = List.of("vendedores", "productos", "productosprecargados");
            if (!carpetasPermitidas.contains(tipo)) {
                throw new BusinessException("Carpeta no permitida", HttpStatus.BAD_REQUEST);
            }

            // 2. Construcción de ruta segura
            Path filePath = BASE_UPLOADS_PATH.resolve(tipo).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new BusinessException("La imagen no existe o no se puede leer", HttpStatus.NOT_FOUND);
            }

            return resource;
        } catch (MalformedURLException e) {
            throw new BusinessException("Error al acceder al archivo", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public void guardarFotoProducto(MultipartFile archivo, String nombreArchivo) {
        guardarFoto(archivo, "productos", nombreArchivo);
    }

    public void guardarFotoVendedor(MultipartFile archivo, String nombreArchivo) {
        guardarFoto(archivo, "vendedores", nombreArchivo);
    }

    /**
     * Orquestador para guardar la foto físicamente.
     */
    public void guardarFoto(MultipartFile archivo, String subdirectorio, String nombreArchivo) {
        guardarEnDisco(archivo, nombreArchivo, subdirectorio);
    }

    /**
     * Elimina una imagen del servidor.
     */
    public void eliminarImagen(String nombreArchivo, String subdirectorio) {
        if (nombreArchivo == null || nombreArchivo.isBlank()) {
            logger.warn("No se proporcionó nombre de archivo para eliminar.");
            return;
        }

        // Si el nombre contiene el prefijo "productos/", lo limpiamos para resolver la ruta correctamente
        String nombreLimpio = nombreArchivo.contains("/")
                ? nombreArchivo.substring(nombreArchivo.lastIndexOf("/") + 1)
                : nombreArchivo;

        Path rutaArchivo = construirRuta(nombreLimpio, subdirectorio);

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
            String extension = fileNameGenerator.obtenerExtensionArchivo(nombreArchivo).substring(1).toLowerCase();

            // Normalización de extensiones para el redimensionamiento
            if (extension.equals("jfif") || extension.equals("jpeg")) {
                extension = "jpg";
            }

            // Redimensionar antes de guardar para ahorrar espacio
            byte[] contenidoRedimensionado = imageService.resizeImage(contenido, 1000, extension);

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

    /**
     * Valida el archivo y genera un nombre único basado en UUID.
     */
    public String prepararNombre(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("Debes seleccionar una foto.");
        }
        fileValidator.validarArchivo(archivo);
        return fileNameGenerator.generarNombreUnico(archivo);
    }
}