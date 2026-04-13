package ies.juanbosoco.locuventas_backend.repositories.venta;

import ies.juanbosoco.locuventas_backend.entities.venta.Venta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    Page<Venta> findByCanceladaFalseAndEstadoPagoIn(List<Venta.EstadoPago> estados, Pageable pageable);
    //Sobrecarga, en post de intentar soportar paginación
    Page<Venta> findByVendedor_Id(Long vendedorId, Pageable pageable);
    Page<Venta> findByCanceladaFalseAndEstadoPagoInAndVendedor_Id(List<Venta.EstadoPago> estados, Long vendedorId, Pageable pageable);

}
