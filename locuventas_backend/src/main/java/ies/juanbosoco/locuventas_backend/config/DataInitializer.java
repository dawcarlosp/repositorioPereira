package ies.juanbosoco.locuventas_backend.config;

import ies.juanbosoco.locuventas_backend.entities.Vendedor;
import ies.juanbosoco.locuventas_backend.repositories.UserEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserEntityRepository vendedorRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Override
    public void run(String... args) {
        if (!vendedorRepository.existsAdmin()) {
            Vendedor admin = Vendedor.builder()
                    .email("admin@locutorio.com")
                    .password(passwordEncoder.encode("admin123"))
                    .nombre("Administrador")
                    .authorities(List.of("ROLE_ADMIN"))
                    .foto("default.jpg")  // o una imagen por defecto
                    .build();

            vendedorRepository.save(admin);
            System.out.println("✔ Admin creado por defecto.");
        } else {
            System.out.println("ℹ Ya hay un administrador, no se crea uno nuevo.");
        }
    }
}
