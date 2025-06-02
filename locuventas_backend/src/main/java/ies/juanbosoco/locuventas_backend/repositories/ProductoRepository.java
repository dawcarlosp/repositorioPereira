package ies.juanbosoco.locuventas_backend.repositories;

import ies.juanbosoco.locuventas_backend.entities.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByPaisIn(List<Pais> paises);
    List<Producto> findByCategorias_Categoria_Id(Long categoriaId);
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
}
