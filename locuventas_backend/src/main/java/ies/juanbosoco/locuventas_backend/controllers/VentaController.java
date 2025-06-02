@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private PagoRepository pagoRepository;

    // GET /ventas?estado=PAGADO&cancelada=false&page=0&size=10
    @GetMapping
    public ResponseEntity<Page<Venta>> obtenerVentas(
            @RequestParam(required = false) Venta.EstadoPago estado,
            @RequestParam(required = false) Boolean cancelada,
            Pageable pageable) {

        Page<Venta> ventas = ventaRepository.findByEstadoAndCancelada(estado, cancelada, pageable);
        return ResponseEntity.ok(ventas);
    }

    // PATCH /ventas/{id}/cancelar
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

    // POST /ventas/{id}/pago
   @PostMapping("/{id}/pago")
    public ResponseEntity<?> registrarPago(@PathVariable Long id, @RequestBody @Valid PagoRequest pagoRequest) {
    Optional<Venta> ventaOpt = ventaRepository.findById(id);
    if (ventaOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Venta no encontrada"));
    }

    Venta venta = ventaOpt.get();

    Pago pago = Pago.builder()
            .venta(venta)
            .monto(pagoRequest.getMonto())
            .fechaPago(LocalDate.now())
            .build();

    pagoRepository.save(pago);

    venta.getPagos().add(pago);
    venta.actualizarTotalesYEstado();
    ventaRepository.save(venta);

    return ResponseEntity.ok(venta);
}

}
