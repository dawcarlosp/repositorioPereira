package ies.juanbosoco.locuventas_backend.repositories;
import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserEntityRepository extends JpaRepository<Vendedor, String>{
    Optional<Vendedor> findByEmail(String email);
}
