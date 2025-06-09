package ies.juanbosoco.locuventas_backend.mappers;

import ies.juanbosoco.locuventas_backend.DTO.venta.VentaResponseDTO;
import ies.juanbosoco.locuventas_backend.entities.Venta;
import org.springframework.stereotype.Component;

@Component
public class VentaMapper {
    public VentaResponseDTO toDto(Venta venta) {
        return VentaResponseDTO.builder()
                .id(venta.getId())
                .total(venta.getTotal())
                .montoPagado(venta.getMontoPagado())
                .saldo(venta.getSaldoPendiente())
                .estadoPago(venta.getEstadoPago().name())
                .vendedor(venta.getVendedor().getNombre())
                .fecha(venta.getCreatedAt())
                .cancelada(venta.isCancelada())
                .build();
    }
}
