package ies.juanbosoco.locuventas_backend.repositories;

import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserEntityRepository extends JpaRepository<Vendedor, Long> {
    Optional<Vendedor> findByEmail(String email);

    boolean existsByEmail(String email);

    // Buscamos usuarios que NO tengan ciertos roles en su lista de authorities
    // La consulta varía según cómo esté implementado el ElementCollection,
    // pero habitualmente con una Query derivativa o JPQL:
    @Query("SELECT v FROM Vendedor v WHERE :adminRole NOT MEMBER OF v.authorities AND :vendedorRole NOT MEMBER OF v.authorities")
    List<Vendedor> findByAuthoritiesNotContaining(String adminRole, String vendedorRole);
}
