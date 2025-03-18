package ies.juanbosoco.locuventas_backend.services;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
@Service
public class ImageService {
    public byte[] resizeImage(byte[] imageBytes, int targetWidth) throws IOException {
        // Convertimos los bytes de imagen a BufferedImage
        ByteArrayInputStream inputStream = new ByteArrayInputStream(imageBytes);
        BufferedImage originalImage = ImageIO.read(inputStream);
        // Redimensionamos manteniendo la relación de aspecto
        BufferedImage resizedImage = Thumbnails.of(originalImage)
                .width(targetWidth) // Solo especificamos el ancho
                .keepAspectRatio(true)
                .asBufferedImage();
        // Convertimos de nuevo la imagen redimensionada a un arreglo de bytes
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, "jpg", outputStream);
        return outputStream.toByteArray();
    }
}