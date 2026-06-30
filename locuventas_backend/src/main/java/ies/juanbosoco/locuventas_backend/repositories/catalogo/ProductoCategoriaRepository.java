package ies.juanbosoco.locuventas_backend.repositories.catalogo;

import ies.juanbosoco.locuventas_backend.entities.catalogo.ProductoCategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoCategoriaRepository extends JpaRepository<ProductoCategoria, Long> {
    @Modifying
    @Query("DELETE FROM ProductoCategoria pc WHERE pc.id.categoriaId = :categoriaId")
    void deleteByCategoriaId(@Param("categoriaId") Long categoriaId);
}
