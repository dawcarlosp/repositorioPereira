package ies.juanbosoco.locuventas_backend.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import ies.juanbosoco.locuventas_backend.constants.Roles;
import ies.juanbosoco.locuventas_backend.entities.*;
import ies.juanbosoco.locuventas_backend.repositories.CategoriaRepository;
import ies.juanbosoco.locuventas_backend.repositories.PaisRepository;
import ies.juanbosoco.locuventas_backend.repositories.ProductoRepository;
import ies.juanbosoco.locuventas_backend.repositories.UserEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



@Component
public class DataInitializer implements CommandLineRunner {


    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.nombre}")
    private String adminNombre;

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    @Autowired
    private UserEntityRepository vendedorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PaisRepository paisRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public void run(String... args) throws Exception {
        initAdminAndVendedor();
        initCategorias();
        initPaises();
        initProductos();
    }

    private void initAdminAndVendedor() {
        if (!vendedorRepository.existsByEmail(adminEmail)) {
            Vendedor adminDocker = Vendedor.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .nombre(adminNombre)
                    .authorities(List.of(Roles.ADMIN, Roles.USER, Roles.VENDEDOR))
                    .foto(null)
                    .build();
            vendedorRepository.save(adminDocker);
            logger.info("Administrador creado desde variables de entorno: {}", adminEmail);
        }


    }


    private void initCategorias() {
        String[] categorias = {
                "Llamadas Internacionales",
                "Recargas Telefónicas",
                "Envío de Dinero",
                "Fotocopias e Impresiones",
                "Internet y Ciber",
                "Venta de Accesorios",
                "Papelería",
                "Pago de Servicios",
                "Trámites y Gestiones",
                "Envío de Paquetería",
                "Alimentos y Bebidas",
                "Venta de Tarjetas SIM",
                "Traducciones",
                "Juegos de Azar/Lotería",
                "Fotografía para Documentos",
                "Otros Servicios"
        };

        int contador = 0;
        for (String nombre : categorias) {
            if (!categoriaRepository.existsByNombre(nombre)) {
                Categoria categoria = Categoria.builder()
                        .nombre(nombre)
                        .build();
                categoriaRepository.save(categoria);
                contador++;
            }
        }

        if (contador > 0) {
            logger.info("Se han insertado " + contador + " categorías.");
        } else {
            logger.warn("ℹ Las categorías ya existen en la base de datos.");
        }
    }


    private void initPaises() throws Exception {
        if (paisRepository.count() > 0) {
            logger.warn("ℹ Paises ya existen en la base de datos.");
            return;
        }

        ObjectMapper mapper = new ObjectMapper();
        JsonNode countries = null;

        //Intenta descargar desde la API
        try {
            logger.info("Descargando países desde la API...");
            URL url = new URL("https://restcountries.com/v3.1/all?fields=name,flags,cca2,cca3");
            countries = mapper.readTree(url);
            logger.info("Países descargados desde la API.");
        } catch (Exception ex) {
            //Si falla, usa el archivo local
            logger.warn(" No se pudo descargar países desde la API, usando archivo local...");
            countries = mapper.readTree(getClass().getResourceAsStream("/paises.json"));
        }

        int contador = 0;
        for (JsonNode country : countries) {
            String nombre = country.path("name").path("common").asText();
            String enlaceFoto = country.path("flags").path("png").asText();
            String codigo = country.path("cca2").asText();

            if (!paisRepository.findByNombre(nombre).isPresent()) {
                Pais pais = Pais.builder()
                        .nombre(nombre)
                        .enlaceFoto(enlaceFoto)
                        .codigo(codigo)
                        .build();
                paisRepository.save(pais);
                contador++;
            }
        }

        logger.info("Se han insertado " + contador + " países.");
    }

    private void initProductos() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode productos = mapper.readTree(getClass().getResourceAsStream("/productos.json"));

        int contador = 0;

        for (JsonNode productoNode : productos) {
            String nombre = productoNode.path("nombre").asText();
            BigDecimal precio = productoNode.path("precio").decimalValue();
            String foto = "productosprecargados/" + productoNode.path("foto").asText();
            Long paisId = productoNode.path("paisId").asLong();
            int iva = productoNode.path("iva").asInt();

            if (productoRepository.existsByNombre(nombre)) continue;

            Pais pais = paisRepository.findById(paisId).orElse(null);
            if (pais == null) {
                System.out.println("País no encontrado para ID " + paisId + " (producto: " + nombre + ")");
                continue;
            }

            // Creamos el producto
            Producto producto = Producto.builder()
                    .nombre(nombre)
                    .precio(precio)
                    .foto(foto)
                    .pais(pais)
                    .iva((double) iva)
                    .categorias(new ArrayList<>())
                    .build();

            //Guardamos el producto primero para que tenga ID
            producto = productoRepository.save(producto);

            //Relacionamos con categorías existentes
            JsonNode categoriaIds = productoNode.path("categoriaIds");
            for (JsonNode categoriaIdNode : categoriaIds) {
                Long categoriaId = categoriaIdNode.asLong();
                Categoria categoria = categoriaRepository.findById(categoriaId).orElse(null);
                if (categoria == null) {
                    logger.warn("Categoría no encontrada con ID " + categoriaId + " para producto " + nombre);
                    continue;
                }

                // Creamos clave compuesta e instancia
                ProductoCategoria relacion = new ProductoCategoria();
                relacion.setProducto(producto);
                relacion.setCategoria(categoria);
                relacion.setId(new ProductoCategoriaId(producto.getId(), categoria.getId()));

                producto.getCategorias().add(relacion);
            }

            // Guardamos el producto actualizado (relaciones se manejan por cascade)
            productoRepository.save(producto);
            contador++;
        }

        logger.info(" Se han insertado " + contador + " productos con sus relaciones.");
    }


}
