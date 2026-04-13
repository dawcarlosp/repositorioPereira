package ies.juanbosoco.locuventas_backend.mappers;

import ies.juanbosoco.locuventas_backend.DTO.venta.LineaVentaResponseDTO;
import ies.juanbosoco.locuventas_backend.DTO.venta.VentaResponseDTO;
import ies.juanbosoco.locuventas_backend.entities.Venta;
import ies.juanbosoco.locuventas_backend.entities.VentaProducto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class VentaMapper {

    public VentaResponseDTO toDto(Venta venta, List<VentaProducto> lineas) {
        return VentaResponseDTO.builder()
                .id(venta.getId())
                .total(venta.getTotal())
                .montoPagado(Optional.ofNullable(venta.getMontoPagado()).orElse(BigDecimal.ZERO))
                .saldo(Optional.ofNullable(venta.getSaldoPendiente()).orElse(venta.getTotal()))
                .estadoPago(venta.getEstadoPago().name())
                .vendedor(venta.getVendedor().getNombre())
                .fecha(venta.getCreatedAt())
                .cancelada(venta.isCancelada())
                .lineas(lineas.stream().map(this::toLineaDto).collect(Collectors.toList()))
                .build();
    }

    private LineaVentaResponseDTO toLineaDto(VentaProducto lp) {
        return LineaVentaResponseDTO.builder()
                .productoId(lp.getProducto().getId())
                .productoNombre(lp.getProducto().getNombre())
                .cantidad(lp.getCantidad())
                .subtotal(lp.getSubtotal())
                .iva(lp.getIva())
                .subtotalConIva(lp.getSubtotalConIva())
                .build();
    }
}