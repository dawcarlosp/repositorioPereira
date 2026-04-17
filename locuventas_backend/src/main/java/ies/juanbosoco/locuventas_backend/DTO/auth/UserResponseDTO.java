package ies.juanbosoco.locuventas_backend.DTO.auth;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long id;
    private String email;
    private String nombre;
    private String foto;
    private List<String> roles;
    private LocalDateTime createdAt;

}
