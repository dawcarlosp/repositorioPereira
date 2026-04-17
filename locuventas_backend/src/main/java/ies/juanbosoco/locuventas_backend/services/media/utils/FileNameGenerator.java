package ies.juanbosoco.locuventas_backend.services.media.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Component
public class FileNameGenerator {
    public  String obtenerExtensionArchivo(String nombreArchivo) {
        int index = nombreArchivo.lastIndexOf('.');
        if (index == -1) {
            throw new IllegalArgumentException("El archivo no tiene extensión válida.");
        }
        return nombreArchivo.substring(index); // incluye el punto, ej: ".png"
    }
    public String generarNombreUnico(MultipartFile archivo) {
        if (archivo.getOriginalFilename() == null || archivo.getOriginalFilename().isEmpty()) {
            throw new IllegalArgumentException("El archivo seleccionado no tiene un nombre válido.");
        }
        String extension = obtenerExtensionArchivo(archivo.getOriginalFilename());
        return UUID.randomUUID().toString() + extension;
    }
}
