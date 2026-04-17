package ies.juanbosoco.locuventas_backend.repositories.catalogo;

import ies.juanbosoco.locuventas_backend.entities.catalogo.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    boolean existsByNombreAndIdNot(String nombre, Long id);
    boolean existsByNombre(String nombre);

}
