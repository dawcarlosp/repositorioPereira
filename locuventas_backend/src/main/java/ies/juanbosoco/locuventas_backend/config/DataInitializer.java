package ies.juanbosoco.locuventas_backend.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import ies.juanbosoco.locuventas_backend.constants.Roles;
import ies.juanbosoco.locuventas_backend.entities.Categoria;
import ies.juanbosoco.locuventas_backend.entities.Pais;
import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import ies.juanbosoco.locuventas_backend.repositories.CategoriaRepository;
import ies.juanbosoco.locuventas_backend.repositories.PaisRepository;
import ies.juanbosoco.locuventas_backend.repositories.UserEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserEntityRepository vendedorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PaisRepository paisRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Override
    public void run(String... args) throws Exception {
        initAdminAndVendedor();
        initCategorias();
        initPaises();
    }

    private void initAdminAndVendedor() {
        // Admin 1
        if (!vendedorRepository.existsByEmail("admin1@locutorio.com")) {
            Vendedor admin1 = Vendedor.builder()
                    .email("admin1@locutorio.com")
                    .password(passwordEncoder.encode("Admin.1234")) // Cumple requisitos de complejidad
                    .nombre("Juan Admin")
                    .authorities(List.of(Roles.ADMIN, Roles.USER, Roles.VENDEDOR))
                    .foto("admin1.jpg")
                    .build();
            vendedorRepository.save(admin1);
            System.out.println("Admin 1 creado.");
        }

        // Admin 2
        if (!vendedorRepository.existsByEmail("admin2@locutorio.com")) {
            Vendedor admin2 = Vendedor.builder()
                    .email("admin2@locutorio.com")
                    .password(passwordEncoder.encode("Soporte.123")) // Cumple requisitos de complejidad
                    .nombre("Maria Soporte")
                    .authorities(List.of(Roles.ADMIN, Roles.USER, Roles.VENDEDOR))
                    .foto("admin2.jpg")
                    .build();
            vendedorRepository.save(admin2);
            System.out.println("Admin 2 creado.");
        }

        // Admin 3
        if (!vendedorRepository.existsByEmail("admin3@locutorio.com")) {
            Vendedor admin3 = Vendedor.builder()
                    .email("admin3@locutorio.com")
                    .password(passwordEncoder.encode("Gestion.123")) // Cumple requisitos de complejidad
                    .nombre("Luis Gestion")
                    .authorities(List.of(Roles.ADMIN, Roles.USER, Roles.VENDEDOR))
                    .foto("admin3.jpg")
                    .build();
            vendedorRepository.save(admin3);
            System.out.println("Admin 3 creado.");
        }

        // Vendedor estándar
        if (!vendedorRepository.existsVendedor()) {
            Vendedor vendedor = Vendedor.builder()
                    .email("vendedor@locutorio.com")
                    .password(passwordEncoder.encode("Vendedor.123"))
                    .nombre("Pedro Vendedor")
                    .authorities(List.of(Roles.VENDEDOR, Roles.USER))
                    .foto("vendedor.jpg")
                    .build();
            vendedorRepository.save(vendedor);
            System.out.println("Vendedor creado por defecto.");
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
            System.out.println("✔ Se han insertado " + contador + " categorías.");
        } else {
            System.out.println("ℹ Las categorías ya existen en la base de datos.");
        }
    }


    private void initPaises() throws Exception {
        if (paisRepository.count() > 0) {
            System.out.println("ℹ Paises ya existen en la base de datos.");
            return;
        }

        ObjectMapper mapper = new ObjectMapper();
        JsonNode countries = null;

        //Intenta descargar desde la API
        try {
            System.out.println("Descargando países desde la API...");
            URL url = new URL("https://restcountries.com/v3.1/all?fields=name,flags,cca2,cca3");
            countries = mapper.readTree(url);
            System.out.println("Países descargados desde la API.");
        } catch (Exception ex) {
            //Si falla, usa el archivo local
            System.out.println(" No se pudo descargar países desde la API, usando archivo local...");
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

        System.out.println("Se han insertado " + contador + " países.");
    }



}
