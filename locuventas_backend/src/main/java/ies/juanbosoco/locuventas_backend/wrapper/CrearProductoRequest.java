package ies.juanbosoco.locuventas_backend.wrapper;

import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoCreateDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.web.multipart.MultipartFile;

@Schema(description = "Datos para crear un producto con imagen")
public class CrearProductoRequest {
    @Schema(description = "Datos del producto en JSON", implementation = ProductoCreateDTO.class)
    private String producto;

    @Schema(description = "Imagen del producto", type = "string", format = "binary")
    private MultipartFile foto;
}
