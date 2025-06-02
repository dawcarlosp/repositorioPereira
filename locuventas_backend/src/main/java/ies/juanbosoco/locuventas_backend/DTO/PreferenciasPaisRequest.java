public class PreferenciasPaisRequest {
    @NotEmpty(message = "Debe seleccionar al menos un país")
    private List<Long> paisIds;
}
