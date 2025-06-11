package ies.juanbosoco.locuventas_backend.repositories;

import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import ies.juanbosoco.locuventas_backend.entities.Venta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    @Query("SELECT v FROM Venta v WHERE " +
            "(:estado IS NULL OR v.estadoPago = :estado) AND " +
            "(:cancelada IS NULL OR v.cancelada = :cancelada)")
    Page<Venta> findByEstadoAndCancelada(@Param("estado") Venta.EstadoPago estado,
                                         @Param("cancelada") Boolean cancelada,
                                         Pageable pageable);
    List<Venta> findByVendedor_Id(Long vendedorId);
    // En VentaRepository
    Page<Venta> findByCanceladaFalseAndEstadoPagoIn(List<Venta.EstadoPago> estados, Pageable pageable);
    Page<Venta> findByVendedor_IdAndCanceladaFalseAndEstadoPagoIn(Long vendedorId, List<Venta.EstadoPago> estados, Pageable pageable);
    //Sobrecarga, en post de intentar soportar paginación
    Page<Venta> findByVendedor_Id(Long vendedorId, Pageable pageable);
    Page<Venta> findByCanceladaFalseAndEstadoPagoInAndVendedor_Id(List<Venta.EstadoPago> estados, Long vendedorId, Pageable pageable);

}
