package ies.juanbosoco.locuventas_backend.repositories;

import ies.juanbosoco.locuventas_backend.entities.Pais;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaisRepository extends JpaRepository<Pais, Long> {
}
