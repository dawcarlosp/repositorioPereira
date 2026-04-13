package ies.juanbosoco.locuventas_backend.repositories.venta;

import ies.juanbosoco.locuventas_backend.entities.venta.VentaProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VentaProductoRepository extends JpaRepository<VentaProducto, Long> {
    List<VentaProducto> findByVenta_Id(Long ventaId);
    // Método para comprobar si existen ventas con un producto concreto
    boolean existsByProducto_Id(Long productoId);
    long countByVenta_Id(Long ventaId);
}
