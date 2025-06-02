@Data
@Builder
public class VentaResponseDTO {
    private Long id;
    private BigDecimal total;
    private BigDecimal montoPagado;
    private BigDecimal saldo;
    private String estadoPago;
    private String vendedor;
    private LocalDateTime fecha;
    private boolean cancelada;
}
