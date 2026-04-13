package ies.juanbosoco.locuventas_backend.controllers;

import ies.juanbosoco.locuventas_backend.DTO.common.PageDTO;
import ies.juanbosoco.locuventas_backend.DTO.venta.*;
import ies.juanbosoco.locuventas_backend.controllers.docs.VentaApi;
import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import ies.juanbosoco.locuventas_backend.entities.Venta;
import ies.juanbosoco.locuventas_backend.errors.BusinessException;
import ies.juanbosoco.locuventas_backend.mappers.VentaMapper;
import ies.juanbosoco.locuventas_backend.repositories.UserEntityRepository;
import ies.juanbosoco.locuventas_backend.services.VentaService;
import ies.juanbosoco.locuventas_backend.services.VentaTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ventas")
@RequiredArgsConstructor
public class VentaController implements VentaApi {

    private final VentaService ventaService;
    private final VentaTicketService ticketService;
    private final VentaMapper ventaMapper;
    private final UserEntityRepository userRepository;

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<PageDTO<VentaResponseDTO>> getVentas(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Vendedor vendedor = getVendedorActual(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // El servicio decide si filtrar por vendedor o mostrar todo según el rol
        Page<Venta> ventasPage = ventaService.findAll(vendedor, pageable);

        Page<VentaResponseDTO> dtos = ventasPage.map(v -> ventaMapper.toDto(v, v.getLineas()));

        return ResponseEntity.ok(new PageDTO<>(
                dtos.getContent(),
                dtos.getNumber(),
                dtos.getTotalPages(),
                dtos.getTotalElements()
        ));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<PageDTO<VentaResponseDTO>> getVentasPendientes(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Vendedor vendedor = getVendedorActual(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Venta> pendientesPage = ventaService.getVentasPendientes(vendedor, pageable);
        Page<VentaResponseDTO> dtos = pendientesPage.map(v -> ventaMapper.toDto(v, v.getLineas()));

        return ResponseEntity.ok(new PageDTO<>(
                dtos.getContent(),
                dtos.getNumber(),
                dtos.getTotalPages(),
                dtos.getTotalElements()
        ));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<VentaResponseDTO> getVenta(@PathVariable Long id) {
        Venta venta = ventaService.findById(id);
        return ResponseEntity.ok(ventaMapper.toDto(venta, venta.getLineas()));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<VentaResponseDTO> crearVenta(@RequestBody VentaRequestDTO request, Authentication authentication) {
        Vendedor vendedor = getVendedorActual(authentication);
        Venta nuevaVenta = ventaService.crearVenta(request, vendedor);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ventaMapper.toDto(nuevaVenta, nuevaVenta.getLineas()));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<VentaResponseDTO> registrarPago(@PathVariable Long id, @RequestBody PagoRequestDTO request) {
        Venta venta = ventaService.registrarPago(id, request.getMonto());
        return ResponseEntity.ok(ventaMapper.toDto(venta, venta.getLineas()));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cancelarVenta(@PathVariable Long id) {
        ventaService.cancelarVenta(id);
        return ResponseEntity.ok(Map.of("mensaje", "Venta cancelada correctamente"));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<byte[]> descargarTicketPdf(@PathVariable Long id) {
        try {
            Venta venta = ventaService.findById(id);
            byte[] pdfBytes = ticketService.generarTicketPDF(venta);
            String nombreArchivo = ticketService.generarNombreArchivo(venta);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nombreArchivo + "\"")
                    .body(pdfBytes);
        } catch (Exception e) {
            throw new BusinessException("Error al generar el ticket PDF: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // --- MÉTODOS PRIVADOS DE APOYO ---

    private Vendedor getVendedorActual(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new BusinessException("Vendedor no encontrado", HttpStatus.UNAUTHORIZED));
    }
}