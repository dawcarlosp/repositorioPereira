package ies.juanbosoco.locuventas_backend.repositories.catalogo;

import ies.juanbosoco.locuventas_backend.entities.catalogo.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByCategorias_Categoria_Id(Long categoriaId);
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    List<Producto> findByPais_Id(Long paisId);
    boolean existsByNombre(String nombre);
    @Query("SELECT DISTINCT p FROM Producto p " +
            "LEFT JOIN FETCH p.categorias pc " +
            "LEFT JOIN FETCH pc.categoria " +
            "LEFT JOIN FETCH p.pais")
    Page<Producto> findAllWithCategories(Pageable pageable);

    @Query("SELECT DISTINCT p FROM Producto p " +
            "LEFT JOIN FETCH p.categorias pc " +
            "LEFT JOIN FETCH pc.categoria " +
            "LEFT JOIN FETCH p.pais " +
            "WHERE (:search IS NULL OR :search = '' OR " +
            "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Producto> findAllWithCategoriesAndSearch(
            @Param("search") String search,
            Pageable pageable
    );

    @Query("SELECT DISTINCT p FROM Producto p " +
            "LEFT JOIN FETCH p.categorias pc " +
            "LEFT JOIN FETCH pc.categoria c " +
            "LEFT JOIN FETCH p.pais " +
            "WHERE (:paisId IS NULL OR p.pais.id = :paisId) AND " +
            "(:categoriaId IS NULL OR c.id = :categoriaId) AND " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Producto> findAllWithFilters(
            @Param("paisId") Long paisId,
            @Param("categoriaId") Long categoriaId,
            @Param("search") String search,
            Pageable pageable
    );
}
