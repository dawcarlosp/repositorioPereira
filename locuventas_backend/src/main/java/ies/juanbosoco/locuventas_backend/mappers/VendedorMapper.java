package ies.juanbosoco.locuventas_backend.mappers;

import ies.juanbosoco.locuventas_backend.DTO.auth.UserResponseDTO;
import ies.juanbosoco.locuventas_backend.entities.auth.Vendedor;
import org.springframework.stereotype.Component;

@Component
public class VendedorMapper {

    public UserResponseDTO mapToResponseDTO(Vendedor vendedor) {
        return UserResponseDTO.builder()
                .id(vendedor.getId())
                .email(vendedor.getEmail())
                .nombre(vendedor.getNombre())
                .foto(vendedor.getFoto())
                .roles(vendedor.getAuthoritiesRaw())
                .createdAt(vendedor.getCreatedAt())
                .build();
    }
}
