package ies.juanbosoco.locuventas_backend.controllers;

import ies.juanbosoco.locuventas_backend.DTO.common.PageDTO;
import ies.juanbosoco.locuventas_backend.DTO.venta.*;
import ies.juanbosoco.locuventas_backend.entities.*;
import ies.juanbosoco.locuventas_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ventas")
@PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
@RequiredArgsConstructor
public class VentaController {

    private final VentaRepository ventaRepository;
    private final UserEntityRepository vendedorRepository;
    private final ProductoRepository productoRepository;
    private final VentaProductoRepository ventaProductoRepository;
    // === LISTAR SOLO VENTAS PENDIENTES O PARCIALES (TODOS VEN VEN TODO) ===
    @GetMapping("/pendientes")
    public ResponseEntity<PageDTO<VentaResponseDTO>> getVentasPendientes(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        List<Venta.EstadoPago> estados = Arrays.asList(Venta.EstadoPago.PENDIENTE, Venta.EstadoPago.PARCIAL);

        // Si quieres filtrar por vendedor aquí, puedes añadir la lógica
        Page<Venta> ventas = ventaRepository.findByCanceladaFalseAndEstadoPagoIn(estados, pageable);
        Page<VentaResponseDTO> pendientes = ventas.map(this::toDto);

        PageDTO<VentaResponseDTO> dto = new PageDTO<>(
                pendientes.getContent(),
                pendientes.getNumber(),
                pendientes.getTotalPages(),
                pendientes.getTotalElements()
        );

        return ResponseEntity.ok(dto);
    }

    // --- DTO para respuesta DETALLADA ---
    private VentaResponseDTO toDto(Venta venta, List<VentaProducto> lineas) {
        return VentaResponseDTO.builder()
                .id(venta.getId())
                .total(venta.getTotal())
                .montoPagado(venta.getMontoPagado() != null ? venta.getMontoPagado() : BigDecimal.ZERO)
                .saldo(venta.getSaldoPendiente() != null ? venta.getSaldoPendiente() : venta.getTotal())
                //Habria que tirar de estáticas en un futuro
                .estadoPago(venta.getEstadoPago() != null ? venta.getEstadoPago().name() : "PENDIENTE")
                .vendedor(venta.getVendedor() != null ? venta.getVendedor().getNombre() : null)
                .fecha(venta.getCreatedAt())
                .cancelada(venta.isCancelada())
                .lineas(
                        lineas.stream().map(lp -> LineaVentaResponseDTO.builder()
                                .productoId(lp.getProducto().getId())
                                .productoNombre(lp.getProducto().getNombre())
                                .cantidad(lp.getCantidad())
                                .subtotal(lp.getSubtotal())
                                .build()
                        ).collect(Collectors.toList())
                )
                .build();
    }

    // Usado para devolver ventas desde la BD (recupera las líneas)
    private VentaResponseDTO toDto(Venta venta) {
        List<VentaProducto> lineas = ventaProductoRepository.findByVenta_Id(venta.getId());
        return toDto(venta, lineas);
    }

    // === CREAR NUEVA VENTA CON LÍNEAS ===
    @Transactional
    @PostMapping
    public ResponseEntity<?> crearVenta(@RequestBody VentaRequestDTO ventaRequest, Authentication authentication) {
        String email = authentication.getName();
        Optional<Vendedor> vendedorOpt = vendedorRepository.findByEmail(email);

        if (vendedorOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Vendedor no encontrado"));
        }

        List<LineaVentaDTO> lineasDto = Optional.ofNullable(ventaRequest.getLineas()).orElse(List.of());
        if (lineasDto.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "No hay productos en la venta"));
        }

        Vendedor vendedor = vendedorOpt.get();

        // Calcular total sumando todos los subtotales
        BigDecimal total = lineasDto.stream()
                .map(linea -> BigDecimal.valueOf(linea.getSubtotal() != null ? linea.getSubtotal() : 0.0))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Venta venta = Venta.builder()
                .vendedor(vendedor)
                .total(total)
                .cancelada(false)
                .estadoPago(Venta.EstadoPago.PENDIENTE)
                .build();

        venta = ventaRepository.save(venta);

        // Guardar líneas, validar productos
        List<VentaProducto> lineasGuardadas = new ArrayList<>();
        for (LineaVentaDTO lineaDTO : lineasDto) {
            Optional<Producto> productoOpt = productoRepository.findById(lineaDTO.getProductoId());
            if (productoOpt.isEmpty()) {
                // Si falta un producto, rollback y error
                throw new RuntimeException("Producto no encontrado: " + lineaDTO.getProductoId());
            }
            Producto producto = productoOpt.get();

            VentaProducto linea = VentaProducto.builder()
                    .venta(venta)
                    .producto(producto)
                    .cantidad(lineaDTO.getCantidad())
                    .subtotal(lineaDTO.getSubtotal())
                    .build();

            ventaProductoRepository.save(linea);
            lineasGuardadas.add(linea);
        }

        // Devuelve la venta con líneas detalladas
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(venta, lineasGuardadas));
    }

    // === REGISTRAR UN PAGO EN UNA VENTA ===
    @PostMapping("/{id}/pago")
    public ResponseEntity<?> registrarPago(@PathVariable Long id, @RequestBody PagoRequestDTO pagoRequest) {
        Optional<Venta> ventaOpt = ventaRepository.findById(id);
        if (ventaOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Venta no encontrada"));
        }
        Venta venta = ventaOpt.get();
        if (venta.isCancelada()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "La venta está cancelada"));
        }
        if (pagoRequest.getMonto() == null || pagoRequest.getMonto().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "El monto del pago debe ser mayor que cero"));
        }

        Pago pago = Pago.builder()
                .monto(pagoRequest.getMonto())
                .fechaPago(java.time.LocalDate.now())
                .venta(venta)
                .build();

        venta.getPagos().add(pago);
        venta.actualizarTotalesYEstado();
        ventaRepository.save(venta);

        // Devuelve la venta actualizada (con líneas y pagos)
        return ResponseEntity.ok(toDto(venta));
    }

    // === LISTAR TODAS LAS VENTAS DEL USUARIO LOGUEADO (o todas si es admin) ===
    @GetMapping
    public ResponseEntity<PageDTO<VentaResponseDTO>> getVentas(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String email = authentication.getName();
        Optional<Vendedor> vendedorOpt = vendedorRepository.findByEmail(email);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Venta> ventasPage;

        if (vendedorOpt.isPresent()) {
            Vendedor vendedor = vendedorOpt.get();
            boolean isAdmin = vendedor.getAuthoritiesRaw().stream()
                    .anyMatch(a -> a.equals("ROLE_ADMIN") || a.equals("ADMIN"));
            if (isAdmin) {
                ventasPage = ventaRepository.findAll(pageable);
            } else {
                ventasPage = ventaRepository.findByVendedor_Id(vendedor.getId(), pageable);
            }
        } else {
            ventasPage = Page.empty(pageable);
        }

        Page<VentaResponseDTO> dtos = ventasPage.map(this::toDto);

        PageDTO<VentaResponseDTO> dto = new PageDTO<>(
                dtos.getContent(),
                dtos.getNumber(),
                dtos.getTotalPages(),
                dtos.getTotalElements()
        );

        return ResponseEntity.ok(dto);
    }


    // === DETALLE DE UNA VENTA ===
    @GetMapping("/{id}")
    public ResponseEntity<?> getVenta(@PathVariable Long id) {
        Optional<Venta> ventaOpt = ventaRepository.findById(id);
        if (ventaOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Venta no encontrada"));
        }
        return ResponseEntity.ok(toDto(ventaOpt.get()));
    }

    // === CANCELAR UNA VENTA ===
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarVenta(@PathVariable Long id) {
        Optional<Venta> ventaOpt = ventaRepository.findById(id);
        if (ventaOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Venta no encontrada"));
        }
        Venta venta = ventaOpt.get();
        venta.cancelar(); // Método de entidad que pone cancelada=true
        ventaRepository.save(venta);
        return ResponseEntity.ok(Map.of("mensaje", "Venta cancelada correctamente"));
    }


}
