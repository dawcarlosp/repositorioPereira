package ies.juanbosoco.locuventas_backend.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import ies.juanbosoco.locuventas_backend.entities.Pais;
import ies.juanbosoco.locuventas_backend.entities.Vendedor;
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

    @Override
    public void run(String... args) throws Exception {
        initAdminAndVendedor();
        initPaises();
    }

    private void initAdminAndVendedor() {
        if (!vendedorRepository.existsAdmin()) {
            Vendedor admin = Vendedor.builder()
                    .email("admin@locutorio.com")
                    .password(passwordEncoder.encode("admin123"))
                    .nombre("Administrador")
                    .authorities(List.of("ROLE_ADMIN"))
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
                    .authorities(List.of("ROLE_VENDEDOR"))
                    .foto("default.jpg")
                    .build();
            vendedorRepository.save(vendedor);
            System.out.println("✔ Vendedor creado por defecto.");
        }
    }

    private void initPaises() throws Exception {
        if (paisRepository.count() > 0) {
            System.out.println("ℹ Paises ya existen en la base de datos.");
            return;
        }

        System.out.println("🌍 Descargando países desde la API...");

        URL url = new URL("https://restcountries.com/v3.1/all");
        ObjectMapper mapper = new ObjectMapper();
        JsonNode countries = mapper.readTree(url);

        int contador = 0;
        for (JsonNode country : countries) {
            String nombre = country.path("name").path("common").asText();
            String codigo = country.path("cca2").asText(); // ISO alpha-2
            String enlaceFoto = country.path("flags").path("png").asText();

            if (!paisRepository.findByCodigo(codigo).isPresent()) {
                Pais pais = Pais.builder()
                        .nombre(nombre)
                        .codigo(codigo)
                        .enlaceFoto(enlaceFoto)
                        .build();
                paisRepository.save(pais);
                contador++;
            }
        }

        System.out.println("✔ Se han insertado " + contador + " países.");
    }
}
