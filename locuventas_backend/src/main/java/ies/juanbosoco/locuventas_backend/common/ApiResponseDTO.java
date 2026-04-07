package ies.juanbosoco.locuventas_backend.common;

import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponseDTO<T> {
    private String message;
    private T data;
    private int status;
    private LocalDateTime timestamp;

    // Método estático para éxito
    public static <T> ResponseEntity<ApiResponseDTO<T>> success(String message, T data, HttpStatus status) {
        ApiResponseDTO<T> response = ApiResponseDTO.<T>builder()
                .message(message)
                .data(data)
                .status(status.value())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, status);
    }
    // Método de utilidad para ERROR (se usa en el GlobalHandler)
    public static <T> ResponseEntity<ApiResponseDTO<T>> error(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(
                ApiResponseDTO.<T>builder()
                        .message(message)
                        .status(status.value())
                        .timestamp(LocalDateTime.parse(LocalDateTime.now().toString()))
                        .build()
        );
    }
}
