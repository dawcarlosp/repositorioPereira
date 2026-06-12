package ies.juanbosoco.locuventas_backend.repositories.auth;

import ies.juanbosoco.locuventas_backend.constants.Roles;
import ies.juanbosoco.locuventas_backend.entities.auth.Vendedor;
import ies.juanbosoco.locuventas_backend.entities.catalogo.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    @Query("SELECT v FROM Vendedor v WHERE :admin NOT MEMBER OF v.authorities AND :vendedor NOT MEMBER OF v.authorities")
    Page<Vendedor> findAllWithoutRol(
            @Param("admin") String admin,
            @Param("vendedor") String vendedor,
            Pageable pageable
    );
    // UserEntityRepository.java — añadir esta query
    @Query("SELECT v FROM Vendedor v WHERE " +
            ":admin NOT MEMBER OF v.authorities AND " +
            ":vendedor NOT MEMBER OF v.authorities AND " +
            "(LOWER(v.nombre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(v.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Vendedor> findAllWithoutRolAndSearch(
            @Param("admin") String admin,
            @Param("vendedor") String vendedor,
            @Param("search") String search,
            Pageable pageable
    );
}
