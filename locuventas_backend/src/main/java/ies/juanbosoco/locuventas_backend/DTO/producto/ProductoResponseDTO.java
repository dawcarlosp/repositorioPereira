// src/main/java/ies/juanbosoco/locuventas_backend/DTO/ProductoResponseDTO.java
package ies.juanbosoco.locuventas_backend.DTO.producto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductoResponseDTO {
    private Long id;
    private String nombre;
    private BigDecimal precio;
    private String foto;
    private String paisNombre; // solo el nombre del país
    private String paisFoto;   // URL de la bandera (opcional)
    private List<String> categorias; // nombres de las categorías
    private Double iva;

}
