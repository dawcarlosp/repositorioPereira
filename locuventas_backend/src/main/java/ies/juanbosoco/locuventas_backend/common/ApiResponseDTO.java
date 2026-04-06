package ies.juanbosoco.locuventas_backend.common;

import jakarta.persistence.Entity;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ApiResponseDTO { private String message;
    private Object data;
    private int status;
    private String timestamp;

}
