public class PagoRequest {
    @NotNull
    @Getter
    @Setter
    @DecimalMin("0.01")
    private BigDecimal monto;
}