package ies.juanbosoco.locuventas_backend.controllers.docs;

import ies.juanbosoco.locuventas_backend.DTO.common.PageDTO;
import ies.juanbosoco.locuventas_backend.DTO.venta.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@Tag(name = "Ventas", description = "Gestión del ciclo de vida de ventas, cobros y facturación")
public interface VentaApi {

    @Operation(
            summary = "Listar ventas",
            description = "Devuelve una lista paginada de ventas. Los administradores ven todas; los vendedores solo las suyas.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Listado recuperado correctamente")
            }
    )
    @GetMapping
    ResponseEntity<PageDTO<VentaResponseDTO>> getVentas(
            Authentication authentication,
            @Parameter(description = "Número de página (0..N)") @RequestParam int page,
            @Parameter(description = "Tamaño de la página") @RequestParam int size);

    @Operation(
            summary = "Listar ventas pendientes",
            description = "Devuelve ventas con estado PENDIENTE o PARCIAL que no han sido canceladas.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/pendientes")
    ResponseEntity<PageDTO<VentaResponseDTO>> getVentasPendientes(
            Authentication authentication,
            @RequestParam int page,
            @RequestParam int size);

    @Operation(
            summary = "Obtener detalle de venta",
            description = "Recupera la información completa de una venta incluyendo líneas de productos y pagos.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Venta encontrada"),
                    @ApiResponse(responseCode = "404", description = "Venta no existente")
            }
    )
    @GetMapping("/{id}")
    ResponseEntity<?> getVenta(@PathVariable Long id);

    @Operation(
            summary = "Crear nueva venta",
            description = "Registra una venta con múltiples productos. El vendedor se extrae del token JWT.",
            security = @SecurityRequirement(name = "bearerAuth"),
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(
                            examples = @ExampleObject(
                                    name = "Ejemplo de Venta",
                                    value = "{\"lineas\": [{\"productoId\": 1, \"cantidad\": 2}, {\"productoId\": 2, \"cantidad\": 1}]}"
                            )
                    )
            )
    )
    @PostMapping
    ResponseEntity<VentaResponseDTO> crearVenta(@RequestBody VentaRequestDTO ventaRequest, Authentication authentication);

    @Operation(
            summary = "Registrar un pago",
            description = "Añade un monto pagado a la venta. Si el monto cubre el total, el estado pasará a PAGADO.",
            security = @SecurityRequirement(name = "bearerAuth"),
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(
                            examples = @ExampleObject(value = "{\"monto\": 50.00}")
                    )
            )
    )
    @PostMapping("/{id}/pago")
    ResponseEntity<VentaResponseDTO> registrarPago(@PathVariable Long id, @RequestBody PagoRequestDTO pagoRequest);

    @Operation(
            summary = "Cancelar venta",
            description = "Marca una venta como cancelada. Solo disponible para usuarios con rol ADMIN.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @PatchMapping("/{id}/cancelar")
    ResponseEntity<?> cancelarVenta(@PathVariable Long id);

    @Operation(
            summary = "Descargar Ticket PDF",
            description = "Genera y descarga el ticket de la venta en formato PDF (Factura simplificada).",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Archivo PDF generado",
                            content = @Content(mediaType = "application/pdf", schema = @Schema(type = "string", format = "binary"))
                    )
            }
    )
    @GetMapping("/{id}/ticket-pdf")
    ResponseEntity<?> descargarTicketPdf(@PathVariable Long id);
}
