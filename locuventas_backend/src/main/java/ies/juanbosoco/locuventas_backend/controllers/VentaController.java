package ies.juanbosoco.locuventas_backend.controllers;

import ies.juanbosoco.locuventas_backend.DTO.common.PageDTO;
import ies.juanbosoco.locuventas_backend.DTO.venta.*;
import ies.juanbosoco.locuventas_backend.entities.*;
import ies.juanbosoco.locuventas_backend.repositories.*;
import ies.juanbosoco.locuventas_backend.services.VentaTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
    @Autowired
    private VentaTicketService ventaTicketService;

    @GetMapping("/pendientes")
    public ResponseEntity<PageDTO<VentaResponseDTO>> getVentasPendientes(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        List<Venta.EstadoPago> estados = Arrays.asList(Venta.EstadoPago.PENDIENTE, Venta.EstadoPago.PARCIAL);

        String email = authentication.getName();
        Optional<Vendedor> vendedorOpt = vendedorRepository.findByEmail(email);

        Page<Venta> ventasPage = vendedorOpt.map(vendedor -> {
            boolean isAdmin = vendedor.getAuthoritiesRaw().stream()
                    .anyMatch(a -> a.equals("ROLE_ADMIN") || a.equals("ADMIN"));
            if (isAdmin) {
                return ventaRepository.findByCanceladaFalseAndEstadoPagoIn(estados, pageable);
            } else {
                return ventaRepository.findByCanceladaFalseAndEstadoPagoInAndVendedor_Id(estados, vendedor.getId(), pageable);
            }
        }).orElse(Page.empty(pageable));

        Page<VentaResponseDTO> pendientes = ventasPage.map(this::toDto);
        PageDTO<VentaResponseDTO> dto = new PageDTO<>(pendientes.getContent(), pendientes.getNumber(), pendientes.getTotalPages(), pendientes.getTotalElements());

        return ResponseEntity.ok(dto);
    }

    private VentaResponseDTO toDto(Venta venta, List<VentaProducto> lineas) {
        return VentaResponseDTO.builder()
                .id(venta.getId())
                .total(venta.getTotal())
                .montoPagado(Optional.ofNullable(venta.getMontoPagado()).orElse(BigDecimal.ZERO))
                .saldo(Optional.ofNullable(venta.getSaldoPendiente()).orElse(venta.getTotal()))
                .estadoPago(Optional.ofNullable(venta.getEstadoPago()).map(Enum::name).orElse("PENDIENTE"))
                .vendedor(Optional.ofNullable(venta.getVendedor()).map(Vendedor::getNombre).orElse(null))
                .fecha(venta.getCreatedAt())
                .cancelada(venta.isCancelada())
                .lineas(
                        lineas.stream().map(lp -> LineaVentaResponseDTO.builder()
                                .productoId(lp.getProducto().getId())
                                .productoNombre(lp.getProducto().getNombre())
                                .cantidad(lp.getCantidad())
                                .subtotal(lp.getSubtotal())
                                .iva(lp.getIva())
                                .subtotalConIva(lp.getSubtotalConIva())
                                .build()
                        ).collect(Collectors.toList())
                )
                .build();
    }

    private VentaResponseDTO toDto(Venta venta) {
        List<VentaProducto> lineas = ventaProductoRepository.findByVenta_Id(venta.getId());
        return toDto(venta, lineas);
    }

    @Transactional
    @PostMapping
    public ResponseEntity<?> crearVenta(@RequestBody VentaRequestDTO ventaRequest, Authentication authentication) {
        String email = authentication.getName();
        Optional<Vendedor> vendedorOpt = vendedorRepository.findByEmail(email);

        if (vendedorOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Vendedor no encontrado"));
        }

        List<LineaVentaDTO> lineasDto = Optional.ofNullable(ventaRequest.getLineas()).orElse(List.of());
        if (lineasDto.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "No hay productos en la venta"));
        }

        Vendedor vendedor = vendedorOpt.get();
        BigDecimal total = BigDecimal.ZERO;

        Venta venta = Venta.builder()
                .vendedor(vendedor)
                .cancelada(false)
                .estadoPago(Venta.EstadoPago.PENDIENTE)
                .build();

        venta = ventaRepository.save(venta);

        List<VentaProducto> lineasGuardadas = new ArrayList<>();
        for (LineaVentaDTO lineaDTO : lineasDto) {
            Optional<Producto> productoOpt = productoRepository.findById(lineaDTO.getProductoId());
            if (productoOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Producto no encontrado: " + lineaDTO.getProductoId()));
            }

            Producto producto = productoOpt.get();
            BigDecimal precio = producto.getPrecio();
            BigDecimal cantidad = BigDecimal.valueOf(lineaDTO.getCantidad());
            BigDecimal subtotal = precio.multiply(cantidad);
            BigDecimal ivaPorcentaje = BigDecimal.valueOf(producto.getIva()); // por ejemplo: 21
            BigDecimal iva = subtotal.multiply(ivaPorcentaje).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal subtotalConIva = subtotal.add(iva);

            VentaProducto linea = VentaProducto.builder()
                    .venta(venta)
                    .producto(producto)
                    .cantidad(lineaDTO.getCantidad())
                    .iva(producto.getIva())
                    .subtotal(subtotal.setScale(2, RoundingMode.HALF_UP).doubleValue())
                    .subtotalConIva(subtotalConIva.setScale(2, RoundingMode.HALF_UP).doubleValue())
                    .build();

            ventaProductoRepository.save(linea);
            lineasGuardadas.add(linea);
            total = total.add(subtotalConIva);
        }

        venta.setTotal(total.setScale(2, RoundingMode.HALF_UP));
        venta = ventaRepository.save(venta);

        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(venta, lineasGuardadas));
    }

    @PostMapping("/{id}/pago")
    public ResponseEntity<?> registrarPago(@PathVariable Long id, @RequestBody PagoRequestDTO pagoRequest) {
        Optional<Venta> ventaOpt = ventaRepository.findById(id);
        if (ventaOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Venta no encontrada"));
        }

        Venta venta = ventaOpt.get();
        if (venta.isCancelada()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "La venta está cancelada"));
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

        return ResponseEntity.ok(toDto(venta));
    }

    @GetMapping
    public ResponseEntity<PageDTO<VentaResponseDTO>> getVentas(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String email = authentication.getName();
        Optional<Vendedor> vendedorOpt = vendedorRepository.findByEmail(email);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Venta> ventasPage = vendedorOpt.map(vendedor -> {
            boolean isAdmin = vendedor.getAuthoritiesRaw().stream()
                    .anyMatch(a -> a.equals("ROLE_ADMIN") || a.equals("ADMIN"));
            return isAdmin ? ventaRepository.findAll(pageable) : ventaRepository.findByVendedor_Id(vendedor.getId(), pageable);
        }).orElse(Page.empty(pageable));

        Page<VentaResponseDTO> dtos = ventasPage.map(this::toDto);
        PageDTO<VentaResponseDTO> dto = new PageDTO<>(dtos.getContent(), dtos.getNumber(), dtos.getTotalPages(), dtos.getTotalElements());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVenta(@PathVariable Long id) {
        Optional<Venta> ventaOpt = ventaRepository.findById(id);

        if (ventaOpt.isPresent()) {
            return ResponseEntity.ok(toDto(ventaOpt.get()));
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Venta no encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }



    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarVenta(@PathVariable Long id) {
        Optional<Venta> ventaOpt = ventaRepository.findById(id);
        if (ventaOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Venta no encontrada"));
        }
        Venta venta = ventaOpt.get();
        venta.cancelar();
        ventaRepository.save(venta);
        return ResponseEntity.ok(Map.of("mensaje", "Venta cancelada correctamente"));
    }

    @GetMapping("/{id}/ticket-pdf")
    public ResponseEntity<?> descargarTicketPdf(@PathVariable Long id) {
        Optional<Venta> ventaOpt = ventaRepository.findById(id);
        if (ventaOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Venta no encontrada"));
        }

        try {
            Venta venta = ventaOpt.get();
            byte[] pdfBytes = ventaTicketService.generarTicketPDF(venta);
            String nombreArchivo = ventaTicketService.generarNombreArchivo(venta);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", nombreArchivo);

            return ResponseEntity.ok().headers(headers).body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error generando PDF: " + e.getMessage()));
        }
    }

}
