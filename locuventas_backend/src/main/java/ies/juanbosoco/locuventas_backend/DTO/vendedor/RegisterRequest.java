package ies.juanbosoco.locuventas_backend.DTO.vendedor;

import org.springframework.web.multipart.MultipartFile;

// Este DTO es SOLO para que Swagger entienda la petición multipart
public record RegisterRequest(
        UserRegisterDTO user,
        MultipartFile foto
) {}