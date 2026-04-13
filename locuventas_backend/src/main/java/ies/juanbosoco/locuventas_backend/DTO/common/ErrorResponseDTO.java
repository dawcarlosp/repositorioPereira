package ies.juanbosoco.locuventas_backend.DTO.common;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ErrorResponseDTO {
    private String error;
    private int status;
    private String timestamp;
    private Object details;
}
