package ies.juanbosoco.locuventas_backend.services;

import net.coobird.thumbnailator.Thumbnails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;

@Service
public class ImageService {
    private static final Logger logger = LoggerFactory.getLogger(ImageService.class);
    static{
        ImageIO.scanForPlugins();
    }
    public ImageService() {
        // Esto fuerza el registro de TwelveMonkeys nada más arrancar el servicio
        ImageIO.scanForPlugins();
    }

    public byte[] resizeImage(byte[] imageBytes, int targetWidth, String extension) throws IOException {

        // LOG TEMPORAL: Imprime esto para ver si "webp" aparece en la lista
        String[] formatos = ImageIO.getWriterFormatNames();
        logger.info("Formatos de escritura disponibles: {}", String.join(", ", formatos));

        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(imageBytes)) {
            BufferedImage originalImage = ImageIO.read(inputStream);

            if (originalImage == null) {
                throw new IOException("No se pudo leer la imagen. Formato '" + extension + "' no soportado.");
            }

            BufferedImage resizedImage = Thumbnails.of(originalImage)
                    .width(targetWidth)
                    .keepAspectRatio(true)
                    .asBufferedImage();

            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                // Si la extensión es jfif o jpeg, usamos "jpg" que es el estándar de ImageIO
                String newFormatName = "jpg";

            if(extension.equalsIgnoreCase("webp") || extension.equalsIgnoreCase("jpeg") || extension.equalsIgnoreCase("jfif")){
                newFormatName = "jpg";
                }

                boolean wrote = ImageIO.write(resizedImage, newFormatName, outputStream);

                if (!wrote) {
                    throw new IOException("No se encontró un escritor para el formato: " + newFormatName);
                }

                return outputStream.toByteArray();
            }
        }
    }
}

