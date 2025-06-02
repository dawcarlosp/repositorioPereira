@RestController
@RequestMapping("/ventas")
public class VentaController {
     private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @GetMapping
    public ResponseEntity<Page<VentaResponseDTO>> obtenerVentas(
            @RequestParam(required = false) Venta.EstadoPago estado,
            @RequestParam(required = false) Boolean cancelada,
            Pageable pageable) {

        Page<VentaResponseDTO> resultado = ventaService.buscarVentasConFiltros(estado, cancelada, pageable);
        return ResponseEntity.ok(resultado);
    }
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarVenta(@PathVariable Long id) {
    ventaService.cancelarVenta(id);
    return ResponseEntity.ok(Map.of("mensaje", "Venta cancelada correctamente"));
}

    @PostMapping("/{id}/pago")
    public ResponseEntity<?> registrarPago(@PathVariable Long id, @RequestBody @Valid PagoRequest dto) {
    VentaResponseDTO updated = ventaService.registrarPago(id, dto.getMonto());
    return ResponseEntity.ok(updated);
}

}

