package ies.juanbosoco.locuventas_backend.repositories.catalogo;

import ies.juanbosoco.locuventas_backend.entities.catalogo.Pais;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaisRepository extends JpaRepository<Pais, Long> {
    Optional<Pais> findByNombre(String nombre);
}
