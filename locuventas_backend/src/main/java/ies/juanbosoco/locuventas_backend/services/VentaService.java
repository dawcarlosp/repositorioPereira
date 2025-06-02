package ies.juanbosoco.locuventas_backend.services;

import ies.juanbosoco.locuventas_backend.DTO.VentaResponseDTO;
import ies.juanbosoco.locuventas_backend.entities.Pago;
import ies.juanbosoco.locuventas_backend.entities.Venta;
import ies.juanbosoco.locuventas_backend.errors.VentaNoEncontradaException;
import ies.juanbosoco.locuventas_backend.mappers.VentaMapper;
import ies.juanbosoco.locuventas_backend.repositories.PagoRepository;
import ies.juanbosoco.locuventas_backend.repositories.VentaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class VentaService { private final VentaRepository ventaRepository;
    private final VentaMapper ventaMapper;
    private final PagoRepository pagoRepository;

    public VentaService(VentaRepository ventaRepository, VentaMapper ventaMapper, PagoRepository pagoRepository) {
        this.ventaRepository = ventaRepository;
        this.ventaMapper = ventaMapper;
        this.pagoRepository = pagoRepository;
    }

    public Page<VentaResponseDTO> buscarVentasConFiltros(Venta.EstadoPago estado, Boolean cancelada, Pageable pageable) {
        Page<Venta> ventas = ventaRepository.findByEstadoAndCancelada(estado, cancelada, pageable);
        return ventas.map(ventaMapper::toDto);
    }
    public void cancelarVenta(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Venta no encontrada"));
        venta.cancelar();
        venta.actualizarTotalesYEstado();
        ventaRepository.save(venta);
    }

    public VentaResponseDTO registrarPago(Long ventaId, BigDecimal monto) {
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> new VentaNoEncontradaException(ventaId));

        Pago nuevoPago = Pago.builder()
                .venta(venta)
                .monto(monto)
                .fechaPago(LocalDate.now())
                .build();

        pagoRepository.save(nuevoPago);
        venta.getPagos().add(nuevoPago);
        venta.actualizarTotalesYEstado();
        ventaRepository.save(venta);

        return ventaMapper.toDto(venta);
    }

}
