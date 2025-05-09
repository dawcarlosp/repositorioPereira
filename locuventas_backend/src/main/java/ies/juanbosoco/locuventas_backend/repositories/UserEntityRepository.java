package ies.juanbosoco.locuventas_backend.repositories;
import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserEntityRepository extends JpaRepository<Vendedor, String>{
    Optional<Vendedor> findByEmail(String email);
    @Query("SELECT COUNT(v) > 0 FROM Vendedor v WHERE 'ROLE_ADMIN' MEMBER OF v.authorities")
    boolean existsAdmin();
}
