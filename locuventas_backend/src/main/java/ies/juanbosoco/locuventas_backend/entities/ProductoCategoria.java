@Entity
public class ProductoCategoria {

    @EmbeddedId
    private ProductoCategoriaId id = new ProductoCategoriaId();

    @ManyToOne
    @MapsId("productoId")
    @JoinColumn(name = "producto_id")
    private Producto producto;

    @ManyToOne
    @MapsId("categoriaId")
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    // Ejemplo de metadatos adicionales
    //private Integer prioridad;
    //private LocalDate fechaAsignacion;
}
