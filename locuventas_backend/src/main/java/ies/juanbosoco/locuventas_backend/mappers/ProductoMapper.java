package ies.juanbosoco.locuventas_backend.mappers;

import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoResponseDTO;
import ies.juanbosoco.locuventas_backend.entities.catalogo.Producto;
import org.springframework.stereotype.Component;

@Component
public class ProductoMapper {
    public ProductoResponseDTO mapToResponseDTO(Producto producto) {
        ProductoResponseDTO dto = new ProductoResponseDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setPrecio(producto.getPrecio());
        dto.setFoto(producto.getFoto());
        dto.setIva(producto.getIva());

        // Mapeo del País (asumiendo que Producto tiene una relación @ManyToOne con Pais)
        if (producto.getPais() != null) {
            dto.setPaisNombre(producto.getPais().getNombre());
            dto.setPaisFoto(producto.getPais().getEnlaceFoto());
        }

        // Mapeo de Categorías (asumiendo @ManyToMany o @ElementCollection)
        if (producto.getCategorias() != null) {
            dto.setCategorias(producto.getCategorias().stream()
                    .map(cat -> cat.getCategoria().getNombre())
                    .toList());
        }

        return dto;
    }
}
