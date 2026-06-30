package ies.juanbosoco.locuventas_backend.services.catalogo;

import ies.juanbosoco.locuventas_backend.DTO.catalogo.CategoriaCreateDTO;
import ies.juanbosoco.locuventas_backend.DTO.catalogo.CategoriaResponseDTO;
import ies.juanbosoco.locuventas_backend.entities.catalogo.Categoria;
import ies.juanbosoco.locuventas_backend.errors.BusinessException;
import ies.juanbosoco.locuventas_backend.repositories.catalogo.CategoriaRepository;
import ies.juanbosoco.locuventas_backend.repositories.catalogo.ProductoCategoriaRepository;
import ies.juanbosoco.locuventas_backend.repositories.catalogo.ProductoRepository;
import ies.juanbosoco.locuventas_backend.repositories.venta.VentaProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoCategoriaRepository productoCategoriaRepository;
    private final ProductoRepository productoRepository;
    private final VentaProductoRepository ventaProductoRepository;

    @Transactional(readOnly = true)
    public List<CategoriaResponseDTO> findAll() {
        return categoriaRepository.findAll(Sort.by(Sort.Direction.ASC, "nombre"))
                .stream()
                .map(c -> new CategoriaResponseDTO(c.getId(), c.getNombre()))
                .toList();
    }

    @Transactional
    public CategoriaResponseDTO create(CategoriaCreateDTO dto) {
        if (categoriaRepository.existsByNombre(dto.getNombre().trim())) {
            throw new BusinessException("Ya existe una categoría con ese nombre", HttpStatus.CONFLICT);
        }
        Categoria categoria = Categoria.builder()
                .nombre(dto.getNombre().trim())
                .build();
        categoria = categoriaRepository.save(categoria);
        return new CategoriaResponseDTO(categoria.getId(), categoria.getNombre());
    }

    @Transactional
    public CategoriaResponseDTO update(Long id, CategoriaCreateDTO dto) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Categoría no encontrada", HttpStatus.NOT_FOUND));

        if (categoriaRepository.existsByNombreAndIdNot(dto.getNombre().trim(), id)) {
            throw new BusinessException("Ya existe otra categoría con ese nombre", HttpStatus.CONFLICT);
        }

        categoria.setNombre(dto.getNombre().trim());
        categoria = categoriaRepository.save(categoria);
        return new CategoriaResponseDTO(categoria.getId(), categoria.getNombre());
    }

    @Transactional
    public int delete(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Categoría no encontrada", HttpStatus.NOT_FOUND));

        int productCount = categoria.getProductosCategorias().size();
        if (productCount > 0) {
            return productCount;
        }

        categoriaRepository.delete(categoria);
        return 0;
    }

    @Transactional
    public void deleteWithProducts(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Categoría no encontrada", HttpStatus.NOT_FOUND));

        List<Long> productIds = categoria.getProductosCategorias().stream()
                .map(pc -> pc.getProducto().getId())
                .toList();

        productoCategoriaRepository.deleteByCategoriaId(id);

        categoriaRepository.delete(categoria);

        for (Long productId : productIds) {
            if (!ventaProductoRepository.existsByProducto_Id(productId)) {
                productoRepository.deleteById(productId);
            }
        }
    }
}