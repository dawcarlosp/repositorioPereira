package ies.juanbosoco.locuventas_backend.services;

import ies.juanbosoco.locuventas_backend.DTO.venta.*;
import ies.juanbosoco.locuventas_backend.entities.*;
import ies.juanbosoco.locuventas_backend.errors.BusinessException;
import ies.juanbosoco.locuventas_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final VentaProductoRepository ventaProductoRepository;

    @Transactional(readOnly = true)
    public Page<Venta> getVentasPendientes(Vendedor vendedor, Pageable pageable) {
        List<Venta.EstadoPago> estados = Arrays.asList(Venta.EstadoPago.PENDIENTE, Venta.EstadoPago.PARCIAL);

        if (vendedor.isAdmin()) {
            return ventaRepository.findByCanceladaFalseAndEstadoPagoIn(estados, pageable);
        } else {
            return ventaRepository.findByCanceladaFalseAndEstadoPagoInAndVendedor_Id(estados, vendedor.getId(), pageable);
        }
    }

    @Transactional
    public Venta crearVenta(VentaRequestDTO request, Vendedor vendedor) {
        if (request.getLineas() == null || request.getLineas().isEmpty()) {
            throw new BusinessException("La venta debe tener al menos una línea", HttpStatus.BAD_REQUEST);
        }

        Venta venta = ventaRepository.save(Venta.builder()
                .vendedor(vendedor)
                .cancelada(false)
                .estadoPago(Venta.EstadoPago.PENDIENTE)
                .build());

        BigDecimal totalVenta = BigDecimal.ZERO;

        for (LineaVentaDTO lineaDto : request.getLineas()) {
            Producto producto = productoRepository.findById(lineaDto.getProductoId())
                    .orElseThrow(() -> new BusinessException("Producto no encontrado: " + lineaDto.getProductoId(), HttpStatus.NOT_FOUND));

            // Cálculos de IVA y Totales
            BigDecimal precio = producto.getPrecio();
            BigDecimal cantidad = BigDecimal.valueOf(lineaDto.getCantidad());
            BigDecimal subtotal = precio.multiply(cantidad);
            BigDecimal iva = subtotal.multiply(BigDecimal.valueOf(producto.getIva()))
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal subtotalConIva = subtotal.add(iva);

            VentaProducto linea = VentaProducto.builder()
                    .venta(venta)
                    .producto(producto)
                    .cantidad(lineaDto.getCantidad())
                    .iva(producto.getIva())
                    .subtotal(subtotal.setScale(2, RoundingMode.HALF_UP).doubleValue())
                    .subtotalConIva(subtotalConIva.setScale(2, RoundingMode.HALF_UP).doubleValue())
                    .build();

            ventaProductoRepository.save(linea);
            totalVenta = totalVenta.add(subtotalConIva);
        }

        venta.setTotal(totalVenta.setScale(2, RoundingMode.HALF_UP));
        return ventaRepository.save(venta);
    }

    @Transactional
    public Venta registrarPago(Long id, BigDecimal monto) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Venta no encontrada", HttpStatus.NOT_FOUND));

        if (venta.isCancelada()) throw new BusinessException("La venta está cancelada", HttpStatus.BAD_REQUEST);
        if (monto == null || monto.compareTo(BigDecimal.ZERO) <= 0)
            throw new BusinessException("El monto debe ser mayor a cero", HttpStatus.BAD_REQUEST);

        venta.getPagos().add(Pago.builder().monto(monto).fechaPago(java.time.LocalDate.now()).venta(venta).build());
        venta.actualizarTotalesYEstado();
        return ventaRepository.save(venta);
    }

    /**
     * Recupera todas las ventas de forma paginada.
     * Si el usuario es ADMIN, recupera todas las ventas del sistema.
     * Si es VENDEDOR, filtra las ventas para que solo vea las que él ha realizado.
     */
    @Transactional(readOnly = true)
    public Page<Venta> findAll(Vendedor vendedor, Pageable pageable) {
        if (vendedor.isAdmin()) {
            return ventaRepository.findAll(pageable);
        }
        return ventaRepository.findByVendedor_Id(vendedor.getId(), pageable);
    }

    @Transactional(readOnly = true)
    public Venta findById(Long id) {
        return ventaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Venta no encontrada con ID: " + id, HttpStatus.NOT_FOUND));
    }

    @Transactional
    public void cancelarVenta(Long id) {
        Venta venta = findById(id);
        venta.cancelar(); // Usamos el método que ya tienes en la entidad
        ventaRepository.save(venta);
    }
}