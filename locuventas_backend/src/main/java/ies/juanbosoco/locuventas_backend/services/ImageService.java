package ies.juanbosoco.locuventas_backend.services;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;

@Service
public class ImageService {

    public byte[] resizeImage(byte[] imageBytes, int targetWidth, String extension) throws IOException {
        ByteArrayInputStream inputStream = new ByteArrayInputStream(imageBytes);
        BufferedImage originalImage = ImageIO.read(inputStream);

        if (originalImage == null) {
            throw new IOException("No se pudo leer la imagen (formato inválido o corrupto).");
        }

        BufferedImage resizedImage = Thumbnails.of(originalImage)
                .width(targetWidth)
                .keepAspectRatio(true)
                .asBufferedImage();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, extension, outputStream);  // usa el formato correcto
        return outputStream.toByteArray();
    }
}
