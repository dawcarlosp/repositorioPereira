package ies.juanbosoco.locuventas_backend.controllers;

import ies.juanbosoco.locuventas_backend.DTO.common.PageDTO;
import ies.juanbosoco.locuventas_backend.DTO.venta.*;
import ies.juanbosoco.locuventas_backend.entities.*;
import ies.juanbosoco.locuventas_backend.repositories.*;
import ies.juanbosoco.locuventas_backend.services.VentaTicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
    @Operation(
            summary = "Listar ventas pendientes o parcialmente pagadas",
            description = "Devuelve una lista paginada de ventas cuyo estado de pago es PENDIENTE o PARCIAL. Solo accesible para ADMIN o VENDEDORES. El ADMIN ve todas, el vendedor solo las suyas.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Listado de ventas pendientes"),
                    @ApiResponse(responseCode = "401", description = "No autenticado o sin permisos"),
            }
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/pendientes")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
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

    @Operation(
            summary = "Crear una nueva venta",
            description = "Crea una venta con una o más líneas. Requiere autenticación. El vendedor se asigna automáticamente desde el token.",
            security = @SecurityRequirement(name = "bearerAuth"),
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = VentaRequestDTO.class),
                            examples = @ExampleObject(
                                    name = "Ejemplo de creación de venta",
                                    value = """
                {
                  "lineas": [
                    { "productoId": 1, "cantidad": 2 },
                    { "productoId": 3, "cantidad": 1 }
                  ]
                }
                """
                            )
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "201", description = "Venta creada correctamente"),
                    @ApiResponse(responseCode = "400", description = "Error en los datos (producto no existe, sin líneas, etc)"),
                    @ApiResponse(responseCode = "401", description = "No autenticado"),
            }
    )
    @SecurityRequirement(name = "bearerAuth")
    @Transactional
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
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

    @Operation(
            summary = "Registrar pago a una venta",
            description = "Registra un pago parcial o total a una venta existente, identificada por su ID.",
            security = @SecurityRequirement(name = "bearerAuth"),
            parameters = {
                    @Parameter(
                            name = "id",
                            description = "ID de la venta a la que se aplicará el pago",
                            required = true,
                            example = "42"
                    )
            },
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = PagoRequestDTO.class),
                            examples = {
                                    @ExampleObject(
                                            name = "Pago parcial",
                                            summary = "Pago parcial de 50€",
                                            value = "{ \"monto\": 50.00 }"
                                    ),
                                    @ExampleObject(
                                            name = "Pago total",
                                            summary = "Pago total de 149.99€",
                                            value = "{ \"monto\": 149.99 }"
                                    )
                            }
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Pago registrado correctamente"),
                    @ApiResponse(responseCode = "400", description = "Error de validación en el monto o venta cancelada"),
                    @ApiResponse(responseCode = "404", description = "Venta no encontrada")
            }
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{id}/pago")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
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


    @Operation(
            summary = "Listar todas las ventas",
            description = "Devuelve una lista paginada de ventas del usuario autenticado. Si el usuario es administrador, devuelve todas las ventas.",
            security = @SecurityRequirement(name = "bearerAuth"),
            parameters = {
                    @Parameter(name = "page", description = "Número de página (por defecto 0)", example = "0"),
                    @Parameter(name = "size", description = "Tamaño de página (por defecto 10)", example = "10")
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "Listado de ventas paginado")
            }
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
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


    @Operation(
            summary = "Obtener detalles de una venta",
            description = "Devuelve toda la información detallada de una venta específica por su ID, incluyendo sus productos, pagos y estado.",
            security = @SecurityRequirement(name = "bearerAuth"),
            parameters = {
                    @Parameter(
                            name = "id",
                            description = "ID de la venta que se desea consultar",
                            required = true,
                            example = "123"
                    )
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "Venta encontrada y retornada correctamente"),
                    @ApiResponse(responseCode = "404", description = "Venta no encontrada")
            }
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<?> getVenta(@PathVariable Long id) {
        Optional<Venta> ventaOpt = ventaRepository.findById(id);

        if (ventaOpt.isPresent()) {
            //para devolver el detalle más organizado
            return ResponseEntity.ok(toDto(ventaOpt.get()));
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Venta no encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @Operation(
            summary = "Cancelar una venta",
            description = "Permite cancelar una venta existente. Solo accesible por administradores.",
            security = @SecurityRequirement(name = "bearerAuth"),
            parameters = {
                    @Parameter(
                            name = "id",
                            description = "ID de la venta a cancelar",
                            required = true,
                            example = "123"
                    )
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "Venta cancelada correctamente"),
                    @ApiResponse(responseCode = "404", description = "Venta no encontrada")
            }
    )
    @SecurityRequirement(name = "bearerAuth")
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


    @Operation(
            summary = "Descargar ticket en PDF",
            description = "Devuelve un archivo PDF con el ticket de la venta especificada.",
            security = @SecurityRequirement(name = "bearerAuth"),
            parameters = {
                    @Parameter(
                            name = "id",
                            description = "ID de la venta para la que se desea obtener el ticket PDF",
                            required = true,
                            example = "456"
                    )
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "PDF generado correctamente",
                            content = @Content(
                                    mediaType = "application/pdf",
                                    schema = @Schema(type = "string", format = "binary")
                            )
                    ),
                    @ApiResponse(responseCode = "404", description = "Venta no encontrada"),
                    @ApiResponse(responseCode = "500", description = "Error interno al generar el PDF")
            }
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}/ticket-pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
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
