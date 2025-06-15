package ies.juanbosoco.locuventas_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("LocuVentas API")
                        .description("API REST para el sistema de ventas LocuVentas")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("LocuVentas Team")
                                .email("support@locuventas.com")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Desarrollo")))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT token para autenticación")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth")); // <-- necesario si quieres proteger todos los endpoints
    }
}
