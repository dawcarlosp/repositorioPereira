package ies.juanbosoco.locuventas_backend.repositories;
import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserEntityRepository extends JpaRepository<Vendedor, Long>{
    Optional<Vendedor> findByEmail(String email);
    @Query("SELECT COUNT(v) > 0 FROM Vendedor v WHERE 'ROLE_ADMIN' MEMBER OF v.authorities")
    boolean existsAdmin();
    @Query("SELECT COUNT(v) > 0 FROM Vendedor v WHERE 'ROLE_VENDEDOR' MEMBER OF v.authorities")
    boolean existsVendedor();
    @Query("SELECT v FROM Vendedor v WHERE 'ROLE_VENDEDOR' NOT MEMBER OF v.authorities")
    List<Vendedor> findAllSinRolVendedor();

}
