package ies.juanbosoco.locuventas_backend.services;

import ies.juanbosoco.locuventas_backend.errors.FormatoImagenInvalidoException;
import net.coobird.thumbnailator.Thumbnails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class ImageService {
    private static final Logger logger = LoggerFactory.getLogger(ImageService.class);

    static {
        // Registro manual para asegurar que TwelveMonkeys tome el control de los formatos extra
        ImageIO.scanForPlugins();
    }

    public byte[] resizeImage(byte[] imageBytes, int targetWidth, String extension) throws IOException {
        // 1. Limpiamos la extensión (quitamos el punto si existe)
        String format = extension.replace(".", "").toLowerCase();

        // Mapeo de casos especiales: jfif/jpeg -> jpg (ImageIO prefiere "jpg")
        if (format.equals("jpeg") || format.equals("jfif")) {
            format = "jpg";
        }

        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(imageBytes)) {
            BufferedImage originalImage = ImageIO.read(inputStream);

            if (originalImage == null) {
                throw new FormatoImagenInvalidoException(extension);
            }

            // 2. Redimensionamiento con Thumbnailator
            BufferedImage resizedImage = Thumbnails.of(originalImage)
                    .width(targetWidth)
                    .keepAspectRatio(true)
                    .asBufferedImage();

            // 3. Escritura dinámica según el formato original
            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                boolean wrote = ImageIO.write(resizedImage, format, outputStream);

                if (!wrote) {
                    // Fallback: Si no hay un escritor para el formato (ej. webp fallando),
                    // intentamos con el formato estándar JPG para no perder el archivo.
                    logger.warn("No se encontró escritor para '{}', reintentando con jpg", format);
                    ImageIO.write(resizedImage, "jpg", outputStream);
                }

                return outputStream.toByteArray();
            }
        }
    }
}