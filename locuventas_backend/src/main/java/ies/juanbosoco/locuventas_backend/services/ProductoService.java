package ies.juanbosoco.locuventas_backend.services;

import ies.juanbosoco.locuventas_backend.DTO.common.PageDTO;
import ies.juanbosoco.locuventas_backend.DTO.producto.ProductoResponseDTO;
import ies.juanbosoco.locuventas_backend.entities.Producto;
import ies.juanbosoco.locuventas_backend.repositories.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;

@Service
@RequiredArgsConstructor
public class ProductoService {
    private final ProductoRepository productoRepository;

    public PageDTO<ProductoResponseDTO> getAllProductos(int page, int size) {
        // Ordenamos por nombre para que el listado sea predecible
        Pageable pageable = PageRequest.of(page, size, Sort.by("nombre").ascending());

        Page<Producto> productosPage = productoRepository.findAll(pageable);

        // Mapeamos a tu DTO específico
        return new PageDTO<>(
                productosPage.getContent().stream().map(this::mapToResponseDTO).toList(),
                productosPage.getNumber(),
                productosPage.getTotalPages(),
                productosPage.getTotalElements()
        );
    }

    private ProductoResponseDTO mapToResponseDTO(Producto producto) {
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
