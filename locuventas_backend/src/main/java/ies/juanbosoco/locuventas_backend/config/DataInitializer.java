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
        if (!vendedorRepository.existsAdmin()) {
            Vendedor admin = Vendedor.builder()
                    .email("admin@locutorio.com")
                    .password(passwordEncoder.encode("admin123"))
                    .nombre("Administrador")
                    .authorities(List.of(Roles.ADMIN, Roles.USER, Roles.VENDEDOR))
                    .foto("default.jpg")
                    .build();
            vendedorRepository.save(admin);
            System.out.println("✔ Admin creado por defecto.");
        } else {
            System.out.println("ℹ Ya hay un administrador, no se crea uno nuevo.");
        }

        if (!vendedorRepository.existsVendedor()) {
            Vendedor vendedor = Vendedor.builder()
                    .email("vendedor@locutorio.com")
                    .password(passwordEncoder.encode("vendedor123"))
                    .nombre("Vendedor")
                    .authorities(List.of(Roles.VENDEDOR, Roles.USER))
                    .foto("default.jpg")
                    .build();
            vendedorRepository.save(vendedor);
            System.out.println("✔ Vendedor creado por defecto.");
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

        System.out.println("🌍 Descargando países desde la API...");

        URL url = new URL("https://restcountries.com/v3.1/all?fields=name,flags,cca2,cca3");
        ObjectMapper mapper = new ObjectMapper();
        JsonNode countries = mapper.readTree(url);

        int contador = 0;
        for (JsonNode country : countries) {
            String nombre = country.path("name").path("common").asText();
            String enlaceFoto = country.path("flags").path("png").asText();
            String codigo = country.path("cca2").asText(); // <-- aquí!

            if (!paisRepository.findByNombre(nombre).isPresent()) {
                Pais pais = Pais.builder()
                        .nombre(nombre)
                        .enlaceFoto(enlaceFoto)
                        .codigo(codigo)    // <-- añade esto a tu entidad y builder
                        .build();
                paisRepository.save(pais);
                contador++;
            }

        }

        System.out.println("✔ Se han insertado " + contador + " países.");
    }


}
