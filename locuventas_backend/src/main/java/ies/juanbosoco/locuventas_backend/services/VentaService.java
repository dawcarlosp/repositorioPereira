@Service
public class VentaService {

    private final VentaRepository ventaRepository;
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
    venta.actualizarEstadoPago();
    ventaRepository.save(venta);
}

    public VentaResponseDTO registrarPago(Long ventaId, BigDecimal monto) {
    Venta venta = ventaRepository.findById(ventaId)
            .orElseThrow(() -> new VentaNoEncontradaException("Venta no encontrada"));

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
