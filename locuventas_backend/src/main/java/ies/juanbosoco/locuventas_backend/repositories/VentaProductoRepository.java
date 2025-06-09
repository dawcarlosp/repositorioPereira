package ies.juanbosoco.locuventas_backend.repositories;

import ies.juanbosoco.locuventas_backend.entities.VentaProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VentaProductoRepository extends JpaRepository<VentaProducto, Long> {
    List<VentaProducto> findByVenta_Id(Long ventaId);

}
